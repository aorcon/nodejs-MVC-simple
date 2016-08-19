
var fs = require('fs');
var Promise = require('promise');

// var Functions = function(){
//
// };
//load library promise. lib_path: full path.
exports.loadlibrary = function(lib_path){
    return new Promise(function(resolve, reject) {
        if (lib_path.endsWith('.js')) lib_path = lib_path.substring(0, lib_path.length - 3);
        fs.access(lib_path + '.js', fs.constants.R_OK, function(err){
            if (err){
                resolve({'error': err, 'code': -1});
            }else{
                try {
                    var lib = require(lib_path);
                    resolve(lib);
                } catch (e) {
                    resolve({'error': e, 'code': -1});
                }
            }
        });
    });
}

exports.listfile = function(path, filter){
    return new Promise(function(resolve, reject){
        // console.log('LIST Dir');
        fs.readdir(path, function(error, files){
            if (error){
                // console.log('LIST DIR ERROR');
                reject(error);
            }else{

                var result = [];
                for (var key in files) {
                    if (files.hasOwnProperty(key)) {
                        if (filter){
                            var matchs = filter.match(files[key]);
                            if (matchs){
                                result.push(files[key]);
                            }
                        }else {
                            result.push(files[key]);
                        }
                    }
                }
                // console.log('LIST DIR OK');
                resolve(result);
            }
        });
    });
}

// exports = module.exports = Functions;
