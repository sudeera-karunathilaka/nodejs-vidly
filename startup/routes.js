
const express = require('express');
const error = require('../middleware/error');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const login = require('../routes/login');

function routing(app){
    //Enable JSON
    app.use(express.json());
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
}

module.exports = routing;