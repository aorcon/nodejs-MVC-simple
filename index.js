var fs = require('fs');
var mixin = require('utils-merge');
var config_file_array = {"redis":true, "db":true};

var index = function(){
	//url setting
	this.domain_root = "addler.com";
	this.domain_name_map = {
		'www':'www',
		'blog':'blog'

	}
	//working directory setting
	this.basedir = __dirname;
	this.filename = __filename;
	this.appdir = 'app';

	//env value in {'development', 'production'}
	this.env = 'development';
	this.DEBUG = true;


	//TODO: log support
	this.logging = console.log;

	//TODO: setting constants.js loading
	//TODO: setting persistent
	//TODO: setting Common loading config
	//TODO: setting controller config
	this.controllerdir = 'controller';
	//TODO: setting View config (defautl & per module)
	this.viewdir = 'views';
	this.view_engine = 'handlebars';
	//TODO: setting MVC config or Route config

	//TODO: load config
	var config_path = this.basedir + '/' + this.appdir + '/config';

	//change to Sync function, session config need this.
	try {
		var configfiles = fs.readdirSync(config_path, 'utf-8');
		if (configfiles instanceof Array){
			for (var key in configfiles) {
				if (configfiles.hasOwnProperty(key)) {
					var options = null;
					try {
						var ldot = configfiles[key].indexOf('.');
						var name = "";
						var ext = configfiles[key].substring(ldot + 1).toLowerCase();
						if (ldot === configfiles[key].lastIndexOf('.')){
							name = configfiles[key].substring(0, ldot).toLowerCase();
						}
						console.log('NAME:' + name);
						console.log('Ext:' + ext);
						var _options = {};
						if (ext === 'json') _options = require(config_path + '/' + configfiles[key]);
						if (name in config_file_array){
							options = {};
							options[name] = _options;
						}else{
							options = _options;
						}

					} catch (e) {
						console.log(e);
					} finally {
						if (options) mixin(this, options);
						console.log(options);
					}

				}
			}
		}
	} catch (e) {
	} finally {

	}
	// fs.readdir(config_path, 'utf-8', (error, files) => {
	// 	if (error) ;
	// 	else{
	// 		for (var key in files){
	// 			var options = null;
	// 			try {
	// 				var ldot = files[key].indexOf('.');
	// 				var name = "";
	// 				var ext = files[key].substring(ldot + 1).toLowerCase();
	// 				if (ldot === files[key].lastIndexOf('.')){
	// 					name = files[key].substring(0, ldot).toLowerCase();
	// 				}
	// 				console.log('NAME:' + name);
	// 				console.log('Ext:' + ext);
	// 				var _options = {};
	// 				if (ext === 'json') _options = require(config_path + '/' + files[key]);
	// 				if (name in config_file_array){
	// 					options = {};
	// 					options[name] = _options;
	// 				}else{
	// 					options = _options;
	// 				}
	//
	// 			} catch (e) {
	// 				console.log(e);
	// 			} finally {
	// 				if (options) mixin(this, options);
	// 				console.log(options);
	// 			}
	// 		}
	// 	}
	// });

}

module.exports = new index();
