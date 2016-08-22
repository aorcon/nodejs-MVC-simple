
var log4js = require('log4js');
var loggers = {};
function init(options){
    log4js.configure(options);
}

function getLogger(name){
    name = name;
    if (loggers[name]) return loggers[name];
    else{
        var logger = log4js.getLogger(name);
        if (logger) {
            var newlogger = {
                logger : logger,
                debug  : function(){
                    this.logger.debug.apply(this.logger, arguments);
                },
                info   : function(){
                    this.logger.info.apply(this.logger, arguments);
                },
                error  : function(){
                    this.logger.error.apply(this.logger, arguments);
                },
                fatal  : function(){
                    this.logger.fatal.apply(this.logger, arguments);
                },
                warn   : function(){
                    this.logger.warn.apply(this.logger, arguments);
                }
            }
            loggers[name] = newlogger;
        }
    }
    return loggers[name];
}

module.exports = {
    init : init,
    getLogger : getLogger
}
