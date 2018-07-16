
const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

function db(){
//Connect to mongo db
mongoose.connect(config.get('db'))
    .then(() => winston.info(`Connected to ${config.get('db')}`));
}
module.exports = db;