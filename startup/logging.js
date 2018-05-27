//Winston to log
const winston = require('winston');
require('winston-mongodb'); //to log errors in to a mongo db

//Use "express-async-errors" to module to handle all errors. No separate error handlers needed.
require('express-async-errors');

function logging(){
//This is to handle any uncaught exceptions.
process.on('uncaughtException', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
});

//This is to handle any uncaught exceptions.
process.on('unhandledRejection', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
});

/*
Both can be replaced by winston as follows
winston.handleExceptions(
    new winston.transports.File({ filename: 'unhandled-exceptions.log'}),
    new winston.transports.Console({colorize: true, prettyPrint: true}));
process.on('unhandledRejection', (ex) => {
    throw ex;//winston.handleExceptions() does not handle "unhandledRejection" errors. 
    //When this exception is thrown, it will handled by winston.handleExceptions()
});

*/



//This is to handle "express" related exceptions
winston.add(winston.transports.File, {filename: 'logfile.log'});
winston.add(winston.transports.MongoDB, {
    db: 'mongodb://localhost/vidly_log',
    level: 'error' 
    /*
    log levels
        error
        warn
        info
        verbose
        debug
        silly
    If we use "info" it will log "error", "warn" and "info"
    */
})
}

module.exports = logging;