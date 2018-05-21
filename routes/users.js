//Express for api's
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const {User, validate} = require('../models/user');

//Bcrypt
const bcrypt = require('bcryptjs');

//Lodash
const _ = require('lodash');

//Can use  "joi-password-complexity" to create a template for the password
/*
    const Joi = require('joi');
    const PasswordComplexity = require('joi-password-complexity');
    
    const complexityOptions = {
    min: 10,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
    }
    
    Joi.validate('aPassword123!', new PasswordComplexity(complexityOptions), (err, value) => {
    //...
    })
*/

//Register a user
router.post('/', async (req, res) => {
    console.log('............................. register user ..................................');
    
    const {error} = validate(req.body);//same as result.error
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).send('User already registered...')
    }

    //pick the values from request using Lodash
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    //hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user = await user.save();

    
    //return a jwt token as a response header
    const token = user.generateAuthToken();
    res.header('x-auth-token', token);
    //manupilate what we send as the response
    //prevent sending password with the response
    res.status(201).send(_.pick(user, ['_id', 'name', 'email']));

});

module.exports = router;