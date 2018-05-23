//TODO Start the app using  this
const express = require('express');
const app = express();

//Winston to log
const winston = require('winston');
require('winston-mongodb'); //to log errors in to a mongo db


//Use "express-async-errors" to module to handle all errors. No separate error handlers needed.
require('express-async-errors');

const error = require('./middleware/error');

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const login = require('./routes/login');

/*
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
Both can be replaced by winston as follows
*/

winston.handleExceptions(new winston.transports.File({ filename: 'unhandled-exceptions.log'}));
process.on('unhandledRejection', (ex) => {
    throw ex;//winston.handleExceptions() does not handle "unhandledRejection" errors. 
    //When this exception is thrown, it will handled by winston.handleExceptions()
});



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

//Read the config files to get jwt-private-key
if(!process.env.jwtPrivateKey){
    console.error('Fatal Error: jwtPrivateKey is not defined.');
    process.exit(1);//0 means success. anything other than 0 means error
}

//To validate object ids
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

//Connect to mongo db
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to vidly db...'))
    .catch(err => console.error('Could not connect to vidly db'));

//Enable JSON
app.use(express.json());
//app.use(express.urlencoded({extended = true}));
app.use(express.static('public'));


//Read config files
const conf = require('./config/config');
conf(app);

//Use genre api's 
app.use('/api/genres', genres);
//Use customer api's 
app.use('/api/customers', customers);
//Use movie api's 
app.use('/api/movies', movies);
//Use rental api's 
app.use('/api/rentals', rentals);
//Use user api's 
app.use('/api/users', users);
//Use auth api's 
app.use('/api/login', login);

app.use(error);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening port ${port}`));