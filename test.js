//
//
// console.log('OK');
// require('app-module-path').addPath('/Users/addler/GitHub/nodejs-MVC-simple/app');
// require('app-module-path').addPath('/Users/addler/GitHub/nodejs-MVC-simple/fk/kernel')
//
// var lib = require('www/controller/index');
// lib.println();

var fs = require('fs');

try {
    var list = fs.readdirSync('/etc/Sync');
} catch (e) {
    console.log(e.stack);
} finally {
    console.log(list);
}
