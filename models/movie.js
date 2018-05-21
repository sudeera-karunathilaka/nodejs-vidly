const mongoose = require('mongoose');
const Joi = require('joi')
const {genreSchema} = require('./genre');

const movieScheme = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0
    },
    dailyRental: {
        type: Number,
        required: true,
        min: 0
    }
});

const Movie = mongoose.model('Movie',  movieScheme);

function validateMovie(movie){
    const schema = {
        title: Joi.string().min(5).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRental: Joi.number().min(0).required()
    }
    return Joi.validate(movie, schema);
}

module.exports.Movie = Movie;
exports.validateMovie = validateMovie;