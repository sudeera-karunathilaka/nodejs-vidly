const mongoose = require('mongoose');
const Joi = require('joi')
const rentalScheme = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true
    },
    //Only a part of customer schema is used
    customer: {
        type: new mongoose.Schema({
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
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title:{
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255,
                trim: true
            },
            dailyRental: {
                type: Number,
                required: true,
                min: 0
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now 
    },
    dateReturned: {
        type: Date
    },
    rentalFee:{
        type: Number,
        min: 0
    }
});

const Rental = mongoose.model('Rental',  rentalScheme);

function validateRental(rental){
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }
    return Joi.validate(rental, schema);
}

module.exports.Rental = Rental;
exports.validateRental = validateRental;