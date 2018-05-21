//Express for api's
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const {Movie, validateMovie} = require('../models/movie');
const {Genre} = require('../models/genre');

//Get all Movies
router.get('', async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

//Get movie by id
router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if(!movie){
        return res.status(404).send('The movie with the given ID does not exist');
    }
    res.send(movie);
});

//Create a movie
router.post('/', auth, async (req, res) => {
    
    const {error} = validateMovie(req.body);//same as result.error
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const genre = await Genre.findById(req.body.genreId);
    if(!genre){
        return res.status(400).send(`Invalid genre: ${req.body.genreId}`);
    }
    let movie = new Movie({ 
        title: req.body.title,
        //Set only the id and name of the genre
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRental: req.body.dailyRental
    });
    movie = await movie.save();
    res.status(201).send(movie);

});

//Update a movie
router.put('/:id', auth, async (req, res) => {
    
    const {error} = validate(req.body);//same as result.error
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre:{
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRental: req.body.dailyRental
    }, {new: true});
    if(!movie){
        return res.status(404).send('The movie with the given ID does not exist');
    }

    res.status(200).send(movie);
});

//Delete a movie
router.delete('/:id', auth, async (req,res) => {

    const movie = await Movie.findByIdAndRemove(req.params.id);
    if(!movie){
        return res.status(404).send('The movie with the given ID does not exist');
    }
    res.status(202).send(movie);
});
module.exports = router;