# nodejs-MVC-simple

# logger.json

{
    "type" : "log4js",  //use log4js middleware
    "default" : "nanaMVC",  //default logger name. without this option, use "default" as default.
    "options" : {       //for log middleware
        "appenders": [
            {
                "type": "dateFile",
                "filename": ".logs/log_file.log",
                "pattern": "-yyyy-MM-dd.log",
                "alwaysIncludePattern": true,
                "category": "nanaMVC",
                "layout": {
                    "type": "basic"
                }
            }
        ],
        "levels": {
            "[all]": "DEBUG",
            "main": "DEBUG"
        }


    }
}
