
var Controller = require('controller');
var mixin = require('utils-merge');

var Test = function(){

}
Test.prototype = Object.create(Controller.prototype);
Test.prototype.constructor = Test;

function fakeclone(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

Test.prototype.indexAction = function(req, res, next){
    var data = {};
    data1 = {
        "a" : "a",
        "b" : "b",
        "c" : {
            "d" : "d"
        }
    }
    data.data = {};
    mixin(data.data, data1);
    data1.c.d = "b";

    console.log(req.session);
    this.render("test/datalist", data, res, next);
}
exports = module.exports = Test;
