var express = require('express');
var Handlebars = require('handlebars');
// var router = express.Router();

/* GET users listing. */
var stringify = function(v){
	if (typeof v === "undefined"){
		return "undefined";
	}
	if (typeof v === "boolean"){
		return "boolean(" + v + ")";
	}
	if (typeof v === "number"){
		return "number(" + v + ")";
	}
	if (typeof v === "string"){
		return "string[" + v.length + "](" + v + ")";
	}
	if (typeof v === "symbol"){
		return "symbol(" + v + ")";
	}
	if (typeof v === "function"){
		return "function(" + v + ")";
	}
	if (v === null){
		return "null";
	}
	if (typeof v === "object"){

	}
	return "unknown(" + v + ")";
}
function serveStatic (req, res, next){
 	// console.log(req.url);
 	var host = req.headers.host;
 	var uri = req.url;
 	var site_name = "addler.com";
 	// var prefix = 
 	var module_name = "";
 	var action_name = "";
 	var domain_name = "";
 	var parameter = {};



 	console.log("host:" + host);
 	console.log("uri:" + uri);











    // var source = "<p>Hello, my name is {{name}}. I am from {{hometown}}. I have " +
    //            "{{kids.length}} kids:</p>" +
    //            "<ul>{{#kids}}<li>{{name}} is {{age}}</li>{{/kids}}</ul>";
  	var source = "<ul> {{#each list}} <li>{{@key}} :: {{this}}</li>{{/each}} </ul>";
	var template = Handlebars.compile(source);
	 
	// var data = { "name": "Alan", "hometown": "Somewhere, TX",
	//              "kids": [{"name": "Jimmy", "age": "12"}, {"name": "Sally", "age": "4"}]};
	var data = {
		"list": {
					host : host,
					uri  : uri,
				}
 	};

	var result = template(data);
	res.send(result);

}
// router.get('/', function(req, res, next) {
// });

module.exports = serveStatic;
