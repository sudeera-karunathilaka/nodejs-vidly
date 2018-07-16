const config = require('config');
const conf = require('../config/config');

function configure(app){
    //Read the config files to get jwt-private-key
    let jwtPrivateKey = process.env.jwtPrivateKey;
    if(!jwtPrivateKey){
        // Only for testing 
        jwtPrivateKey = config.get('jwtPrivateKey');
    }
    if(!jwtPrivateKey){
       throw new Error('FATAL ERROR: jwtPrivateKey not provided');
    }
    //Read config files
    conf(app);
}
module.exports = configure;