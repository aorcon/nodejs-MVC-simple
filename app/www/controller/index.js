
var Controller = require('controller');


var Index = function(){

}
Index.prototype = Object.create(Controller.prototype);
Index.prototype.constructor = Index;


Index.prototype.indexAction = function(req, res, next){
    var data={"title":"learning what's MVC", "body":"by linino", "!":3};
    var views = req.session.views;
    if (!views){
        // this.debug('Add req.session.views ');
        views = req.session.views = {};
    }
    var path = this.CONTROLLER;
    views[path] = (views[path] || 0) + 1;
    // this.debug(req.session);
    this.render("index", data, res, next);
}
exports = module.exports = Index;
