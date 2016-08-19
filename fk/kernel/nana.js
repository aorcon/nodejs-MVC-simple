/*!
 * nanaMVC
 * Copyright(c) 2016-2016
 * MIT Licensed
 */

/**
 * Module nanaMVC
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
// var common = new Common();

var nanaMVC = function(){
	this.rewriterule = [];
	nanaMVC._SERVER = [];
}
nanaMVC.prototype.addRewriterule = function(rule){
	this.rewriterule.push(rule);
}
nanaMVC.prototype.index = function(fn){
	// console.log(fn.env);
	if (typeof fn === 'object'){
		mixin(this, fn);
		require('app-module-path').addPath(__dirname);
		require('app-module-path').addPath(this.basedir + '/' + this.appdir);
		console.log("---->");
		console.log(require.main.paths);
		console.log(this);
	}
}
nanaMVC.prototype.route = function(properties){
	var self = this;
	return function(req, res, next){
		var host = req.headers.host;
		var uri = req.url;
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
		var PATH = {};
		var PARAMS = {};
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

		var params = {
			MODULE : MODULE,
			CONTROLLER : CONTROLLER,
			ACTION : ACTION,
			METHOD : METHOD,
			PATH : PATH,
			PARAMS : PARAMS
		};

		mixin(params, self);

		var moduleName = '';
		if (MODULE){
			if (params.domain_name_map[MODULE]){
				moduleName = params.basedir + '/' + params.appdir
					+ '/' + params.domain_name_map[MODULE].toLowerCase()
					+ '/controller'
					+ '/' + CONTROLLER.toLowerCase() + '.js';
			}
		}
		console.log(moduleName);
		fs.access(moduleName, fs.constants.R_OK, function(err){
			if (err){
				console.log(err);
				next();
			}else{
				//Simple Sandbox:
				//Define sandbox value;
				//library list
				//promiss
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
					    console.log("");
					    console.log(error);
					    Promise.reject({});
					}).then(value => {
					    var Lib = function(){
					    };
					    var lib = new Lib();
					    if (value instanceof Array){
					        for (var key in value) {
					            if (value.hasOwnProperty(key)) {
					                if (value[key].code === -1){
					                    console.log("error" + value[key].error.stack);
					                }else{
					                    merge(lib, value[key].prototype, false);
					                }
					            }
					        }
					    }
						return lib;
					}).catch(error => {
					    console.log(error);
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
							// console.log(Controller);
							controller = new Controller();
							controller.init(params);
							var actionname = ACTION.toLowerCase().trim() + 'Action';
							// console.log(actionname);
							if (controller[actionname]){
								// console.log('1');
								if (typeof controller[actionname] === 'function'){
									// console.log('2');
									controller[actionname](req, res, next);
								}
							}
						} catch (e) {
							if (params.DEBUG) res.send(e.stack.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;'));
							console.log(e.stack);
						} finally {
							console.log('DONE[' + CONTROLLER + '][' + ACTION + ']');
						}

					});
				}else{
					//TODO: load Lib once;
				}

				// console.log(require.main);

			}
		});
		// var cont = new Controller(params);
		// cont.indexAction(req, res);
		// console.log(self);

		// var result = template(data);
		// res.send(result);

	}
}

exports = module.exports = nanaMVC;
