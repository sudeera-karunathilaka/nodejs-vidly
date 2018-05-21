
//Joi for input validations
const Joi = require('joi');
const mongoose = require('mongoose');

const customerScheme = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        minlength:2,
        maxlength:50
    },
    phone:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    dateJoined: {
        type: Date,
        default: Date.now
    }
});


const Customer = mongoose.model('Customer', customerScheme);

function validateCustomer(customer){
    //Input validation
    const schema = { //this schema is used to validate the request body
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    };
    return Joi.validate(customer, schema);

}

exports.Customer = Customer;
exports.validate = validateCustomer;