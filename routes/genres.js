//Express for api's
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

const mongoose = require('mongoose');
const {Genre, validate} = require('../models/genre');

//Get all genres
router.get('', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

//Get genre by id
router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if(!genre){
        return res.status(404).send('The genre with the given ID does not exist');
    }
    res.send(genre);
});

//Create a genre
router.post('/', auth, async (req, res) => {
    
    const {error} = validate(req.body);//same as result.error
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    res.status(201).send(genre);

});

//Update a genre
router.put('/:id', auth, async (req, res) => {
    
    const {error} = validate(req.body);//same as result.error
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});
    if(!genre){
        return res.status(404).send('The genre with the given ID does not exist');
    }

    res.status(200).send(genre);
});

//Delete a genre
router.delete('/:id', [auth, admin], async (req,res) => {

    const genre = await Genre.findByIdAndRemove(req.params.id);
    if(!genre){
        return res.status(404).send('The genre with the given ID does not exist');
    }
    res.status(202).send(genre);
});
module.exports = router;