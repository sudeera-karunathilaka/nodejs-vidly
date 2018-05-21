//Use Config to read configuration files
const DEV_ENV = 'development';
const PROD_ENV = 'production';
const config = require('config');

const morgan = require('morgan');
//set the env variable while running the genre_api.js file
//x

function readConfig(app){
    switch(process.env.NODE_ENV){
        case DEV_ENV:
            // Enable morgan logging only if its development environment
            if(config.get('log.enabled') === true){
                app.use(morgan('short'));
                console.log('Morgon is enabled...');
            }
            return;
        case PROD_ENV:
        console.log(`Env: ${PROD_ENV}`);
            return;

        default:
        console.log(`Env: Default`);
            return;
    }
};

module.exports = readConfig;