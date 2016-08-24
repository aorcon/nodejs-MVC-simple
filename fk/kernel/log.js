var loggers = {};
var level = ['debug', 'info', 'warn', 'error', 'fatal'];
var config = {};
function init(options){
    if (options){
        config = options;
        if (typeof options.type === 'string'){
            if (options.type === 'log4js'){
                var init = require('./logs/log4js').init;
                init(options.options);
            }
        }
    }
}
function getLevel(){
    return level;
}
function getLogger(name){
    name = name || config.default || 'default';
    if (name === 'default' && loggers[name] === undefined){
        loggers['default'] = {
            debug  : function(){
                console.log.apply(null, arguments);
            },
            info   : function(){
                console.info.apply(null, arguments);
            },
            error  : function(){
                console.error.apply(null, arguments);
            },
            fatal  : function(){
                console.log.apply(null, arguments);
            },
            warn   : function(){
                console.warn.apply(null, arguments);
            }
        }
        return loggers[name];
    }
    if (typeof name === 'string'){
        if (loggers[name]) return loggers[name];
        else {
            if (config.type === 'log4js'){
                var getLogger = require('./logs/log4js').getLogger;
                var newlogger = getLogger(name);
                loggers[name] = newlogger;
                return loggers[name];
            }
        }
    }
    return null;
}

module.exports = {
    init : init,
    getLevel : getLevel,
    getLogger : getLogger
}
