
//Joi for input validations
const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        minlength:2,
        maxlength:50
    }
});

const Genre = mongoose.model('Genre', genreSchema);


function validateGenre(genre){
    //Input validation
    const schema = { //this schema is used to validate the request body
        name: Joi.string().min(5).max(50).required()
    };
    return Joi.validate(genre, schema);

}

module.exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenre;