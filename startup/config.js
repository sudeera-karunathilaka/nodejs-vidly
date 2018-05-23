const config = require('config');
const conf = require('../config/config');

function configure(app){
    //Read the config files to get jwt-private-key
    if(!process.env.jwtPrivateKey){
       throw new Error('FATAL ERROR: jwtPrivateKey not provided');
    }
    //Read config files
    conf(app);
}
module.exports = configure;