var
    config = require('./config.js');

var consoleExists = (typeof console != "undefined");

/** Prints a log message to the console */
module.exports.log = function log(msg){
    if(consoleExists && JOBAD.config.debug){
        console.log(msg);
    }
};

/** Prints a warning message to the console */
module.exports.warn = function warn(msg){
    if(consoleExists && JOBAD.config.debug){
        console.warn(msg);
    }
};

/** Prints an error message to the console */
module.exports.error = function error(msg){
    if(consoleExists && JOBAD.config.debug){
        console.error(msg);
    }
};

/** throws an error to the console */
module.exports.throwError = function throwError(msg){
    error(msg);
    throw new Error(msg);
}