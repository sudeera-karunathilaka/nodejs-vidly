const jwt = require('jsonwebtoken');
const config = require('config');

function authenticate(req, res, next){
    //this method works as a middleware function so that any endpoint which uses this function will check for a valid token.
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(402).send('Access denied. No token provided');
    }
    try{
        const decodedToken = jwt.decode(token, process.env.jwtPrivateKey);
        if(!decodedToken){
            res.status(400).send('Invalid token');    
        }
        req.user = decodedToken;
        console.log('Token', token);
        console.log('Decoded token', decodedToken);
        next();
    }
    catch(ex){
        res.status(400).send('Invalid token');
    }
}

module.exports = authenticate;