const Joi = require('joi');
const express = require('express');

function validate (app){
    //To validate object ids
    const Joi = require('joi');
    Joi.objectId = require('joi-objectid')(Joi);
    //app.use(express.urlencoded({extended = true}));
    app.use(express.static('public'));
}

module.exports = validate;