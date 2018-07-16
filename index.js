//TODO Start the app using  this
const express = require('express');
const app = express();
const winston = require('winston');

//Setup logging
require('./startup/logging')();
//setup routes
require('./startup/routes')(app);
//Setup db
require('./startup/db')();
//Setup configurations
require('./startup/config')(app);
//Setup validations
require('./startup/validation')(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening port ${port}`));
module.exports = server;