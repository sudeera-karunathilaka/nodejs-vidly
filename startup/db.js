
const winston = require('winston');

const mongoose = require('mongoose');
function db(){

//Connect to mongo db
mongoose.connect('mongodb://localhost/vidly')
    .then(() => winston.info('Connected to vidly db'));
}

module.exports = db;