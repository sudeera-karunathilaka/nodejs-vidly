//Express for api's
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const {User} = require('../models/user');
const Joi = require('joi');

//Bcrypt
const bcrypt = require('bcryptjs');

//Lodash
const _ = require('lodash');

//Login a user
router.post('/', async (req, res) => {
    //This env variable needs to  be set in command line <set jwtPrivateKey=myKey>
    //Cannot set the env variable using powershell. instead use cmd in admin mode 
    
    const error = validate(req.body);//same as result.error
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    console.log('Request body: ' + req.body);

    let user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(400).send('Invalid email or password')
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        return res.status(400).send('Invalid email or password');
    }

    //return a jwt token as the response
    const token = user.generateAuthToken();
    console.log(token);
    res.status(200).send(token);

});

function validate(req){
    const schema = {
        email: Joi.string().email(),
        password: Joi.string().min(2).max(255).required()
    }
}

module.exports = router;