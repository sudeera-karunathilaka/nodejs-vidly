
//Joi for input validations
const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userScheme = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        minlength:2,
        maxlength:50
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 1024//Password is saved after hashing. Therefore the length of the saved password will be longer than the actual password.
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

/*
 * This code should come before creating the class from the schema
 *      const User = mongoose.model('User', userScheme);
 */
userScheme.methods.generateAuthToken = function(){
    //This cannot be replaced by an arrow function as arrow functions does not support "this" keyword
    const token =  jwt.sign({_id:this._id, isAdmin: this.isAdmin}, process.env.jwtPrivateKey);
    return token;
}

const User = mongoose.model('User', userScheme);

function validateUser(user){
    console.log(user);
    //Input validation
    const schema = { //this schema is used to validate the request body
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email(),
        password: Joi.string().min(2).max(255).required(),
        isAdmin: Joi.boolean()
    };
    return Joi.validate(user, schema);
}
exports.User = User;
exports.validate = validateUser;