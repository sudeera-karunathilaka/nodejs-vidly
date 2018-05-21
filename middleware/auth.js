const jwt = require('jsonwebtoken');
const config = require('config');

function authenticate(req, res, next){
    //this method works as a middleware function so that any endpoint which uses this function will check for a valid token.
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(402).send('Access denied. No token provided');
    }
    try{
        const decodedToken = jwt.decode(toASCII, config.get('jwtPrivateKey'));
        req.user = decodedToken;
        next();
    }
    catch(ex){
        res.status(400).send('Invalid token');
    }
}

module.exports = authenticate;