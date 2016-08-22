

var Handlebars = require('handlebars');
var fs = require('fs');
var loglib = require('./log');
var _ = require('underscore');


var controller = function(){
}

controller.prototype.init = function(params){
    if (params){
        for (var key in params) {
          this[key] = params[key];
        }
    }
    this.logger = loglib.getLogger();
    var level = loglib.getLevel();
    _.map(level, (value) =>{ this[value] = this.logger[value] });
}

controller.prototype.render = function(view, data, responds, callback){
    var result = null;
    var done = callback;
    var options = data || {};
    if (typeof data === 'function'){
        done = data;
        options = {};
    }
    if (typeof view === 'string'){
        if (this.DEBUG){
            //this.view_engine
            var viewpath = this.basedir + '/' + this.appdir + '/' + this.MODULE + '/' + this.viewdir + '/' + view + '.hbs';
            var self = this;
            fs.access(viewpath, fs.constants.R_OK, function(err){
    			if (err){
    				self.debug(err);
    				done();
    			}else{
                    self.debug(viewpath);
                    fs.readFile(viewpath, 'utf8', (err, hbs) => {
                        if (err) done();
                        var template = Handlebars.compile(hbs);
                        var result = template(options);
                        responds.send(result);
                    });
    			}
    		});

        }
    }
}
controller.prototype.indexAction = function(request, response){
    var source = "<ul> {{#each list}} <li>{{@key}} :: {{this}}</li>{{/each}} </ul>";
    var template = Handlebars.compile(source);
    var data = {
        "list" : {
            CONTROLLER : this.CONTROLLER,
            ACTION : this.ACTION,
        }
    }
    var result = template(data);
    this.debug(this);
    response.send(result);
}
module.exports = controller;
