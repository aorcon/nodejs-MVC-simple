/*!
 * nanaMVC
 * Copyright(c) 2016-2016 Addler Huang
 * https://github.com/aorcon/nodejs-MVC-simple
 * MIT Licensed
 */

/**
 * Module nanaMVC
 * this module load config and dispatch request
 * @private
 */

var express = require('express');
var Handlebars = require('handlebars');
var urlparser = require('urlparser');
var mixin = require('utils-merge');
var merge = require('merge-descriptors');
var Controller = require('./controller');
var fs = require('fs');
var Promise = require('promise');
var common = require('./functions');
var loglib = require('./log');
var _ = require('underscore');


var nanaMVC = function(){
	//rewrite rule
	this.rewriterule = [];
	//env
	nanaMVC._SERVER = {};
}
//add rewrite rule
nanaMVC.prototype.addRewriterule = function(rule){
	this.rewriterule.push(rule);
}
//init nanaMVC
nanaMVC.prototype.index = function(fn){
	if (typeof fn === 'object'){
		//add config to nanaMVC
		mixin(this, fn);
		//add library path to nanaMVC project
		require('app-module-path').addPath(__dirname);	//this path
		require('app-module-path').addPath(this.basedir + '/' + this.appdir);  //app path : setted @index.js
	}
	//init logger
	this.logger = loglib.getLogger();
	var level = loglib.getLevel();
	_.map(level, (value) =>{ this[value] = this.logger[value] });
}

//dispatch url to Controller & Action function
nanaMVC.prototype.route = function(properties){
	var self = this;
	return function(req, res, next){
		var host = req.headers.host;	//host
		var uri = req.url;				//uri
		if (self.rewriterule){
			//TODO: URL rewrite
		}
		var h = /^((\w+\.)+\w+)(:(\d+))?$/;
		var matchresult = host.match(h);
		var domainname = undefined;
		var port = undefined;
		var MODULE = "";
		var CONTROLLER = "INDEX";
		var ACTION = "INDEX";
		var METHOD = "";
		var PATH = {};		//request path
		var PARAMS = {};	//request params, only get TODO:// add post support later

		if (matchresult){
			domainname = matchresult[1];
			port = matchresult[4];
		}
		if (domainname) {
			if (domainname.endsWith(self.domain_root)){
				MODULE = domainname.substring(0, domainname.length - self.domain_root.length - 1);
				if (MODULE == '') MODULE = 'www';
			}
		}
		var ret = urlparser.parse(uri);
		if (ret.path && ret.path.base) PATH.path = ret.path.base;
		else PATH.path = "";
		if (ret.query && ret.query.params) PARAMS = ret.query.params;

		if (PATH.path){
			PATH.splits = PATH.path.split('/');
			if (PATH.splits.length > 0){
				CONTROLLER = PATH.splits[0];
			}
			if (PATH.splits.length > 1){
				ACTION = PATH.splits[1];
			}
		}

		//requst Env variable
		var params = {
			MODULE : MODULE,
			CONTROLLER : CONTROLLER,
			ACTION : ACTION,
			METHOD : METHOD,
			PATH : PATH,
			PARAMS : PARAMS
		};

		mixin(params, self);//add nanaMVC env variable to request Env variable

		var moduleName = '';
		//module file name
		if (MODULE){
			if (params.domain_name_map[MODULE]){
				moduleName = params.basedir + '/' + params.appdir
					+ '/' + params.domain_name_map[MODULE].toLowerCase()
					+ '/controller'
					+ '/' + CONTROLLER.toLowerCase() + '.js';
			}
		}
		self.debug(moduleName);
		//check module exist
		fs.access(moduleName, fs.constants.R_OK, function(err){
			if (err){
				console.log(err.stack);
				next();
			}else{
				var lib = {};
				if (params.DEBUG){//NO cache
					// loadlibrary(params.basedir + '/app/common/function.js').then(resolve(1));
					common.listfile(params.basedir + '/app/common/').then(result =>{
						for (var key in result) {
					        if (result.hasOwnProperty(key)) {
					            result[key] = params.basedir + '/app/common/' + result[key];
					        }
					    }
						// return [];
					    return Promise.all(result.map(common.loadlibrary));
					}, error =>{
					    this.debug(error);
					    Promise.reject({});
					}).then(value => {
					    var Lib = function(){
					    };
					    var lib = new Lib();
					    if (value instanceof Array){
					        for (var key in value) {
					            if (value.hasOwnProperty(key)) {
					                if (value[key].code === -1){
					                    this.debug("error" + value[key].error.stack);
					                }else{
					                    merge(lib, value[key].prototype, false);
					                }
					            }
					        }
					    }
						return lib;
					}).catch(error => {
					    this.debug(error);
					}).then(lib => {
						var lib_path = params.basedir + '/' + params.appdir
							+ '/' + params.domain_name_map[MODULE].toLowerCase()
							+ '/controller'
							+ '/' + CONTROLLER.toLowerCase();
						// params.domain_name_map[MODULE].toLowerCase()
						// 	+ '/controller'
						// 	+ '/' + CONTROLLER.toLowerCase();
						delete require.cache[moduleName];
						var controller = null;
						try {
							var Controller = require(lib_path);
							// this.debug(Controller);
							controller = new Controller();
							controller.init(params);
							var actionname = ACTION.toLowerCase().trim() + 'Action';
							// this.debug(actionname);
							if (controller[actionname]){
								if (typeof controller[actionname] === 'function'){
									controller[actionname](req, res, next);
								}
							}
						} catch (e) {
							if (params.DEBUG) res.send(e.stack.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;'));
							this.debug(e.stack);
						} finally {
							this.debug('DONE[' + CONTROLLER + '][' + ACTION + ']');
						}

					});
				}else{
					//TODO: load Lib once;
				}

			}
		});

	}
}

exports = module.exports = nanaMVC;
