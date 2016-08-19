

var Handlebars = require('handlebars');
var fs = require('fs');


var controller = function(){
}

controller.prototype.init = function(params){
    if (params){
        for (var key in params) {
          this[key] = params[key];
        }
    }
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
            fs.access(viewpath, fs.constants.R_OK, function(err){
    			if (err){
    				console.log(err);
    				done();
    			}else{
                    console.log(viewpath);
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
    console.log(this);
    response.send(result);
}
module.exports = controller;
