const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Fawn = require('fawn');

const {Customer, validateCustomer} = require('../models/customer');
const {Movie, validateMovie} = require('../models/movie');
const {Rental, validateRental} = require('../models/rental');

//To handle transactions
Fawn.init(mongoose);

//Get all Rentals
router.get('', async (req, res) => {
    //Sort by dateOut in descending order 
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

//Get rental by id
router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if(!rental){
        return res.status(404).send('The rental with the given ID does not exist');
    }
    res.send(rental);
});

//Create a rental
router.post('/', auth, async (req, res) => {
    
    const {error} = validateRental(req.body);//same as result.error
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const customer = await Customer.findById(req.body.customerId);
    if(!customer){
        return res.status(400).send(`Invalid customer: ${req.body.customerId}`);
    }
    const movie = await Movie.findById(req.body.movieId);
    if(!movie){
        return res.status(400).send(`Invalid movie: ${req.body.movieId}`);
    }
    if(movie.numberInStock === 0){
        return res.status(400).send('Movie not in stock')
    }
    let rental = new Rental({ 
        title: req.body.title,
        //Set only the id and name of the genre
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie.id,
            title: movie.title,
            dailyRental: movie.dailyRental
        }
    });
    
    //Handle following two saves in a single transaction
    /*
        rental = await rental.save();
        //Decreament the number in stock
        movie.numberInStock--;
        movie.save();
    */
   try{
        new Fawn.Task()
            .save('rentals', rental) //Saves the rental. "rentals" is the name of the collection/table in the db
            .update('movies', { _id: movie._id}, { //Updates the existing movie
                $inc: {numberInStock: -1}
            }).run();
        res.status(201).send(rental);
    }
    catch(ex){
        res.status(500).send('Failed when saving rental');
    }
});

//Update a rental
router.put('/:id', auth, async (req, res) => {
    
    const {error} = validateRental(req.body);//same as result.error
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const customer = await Customer.findById(req.body.customerId);
    if(!customer){
        return res.status(400).send(`Invalid customer: ${req.body.customerId}`);
    }
    const movie = await Movie.findById(req.body.movieId);
    if(!movie){
        return res.status(400).send(`Invalid movie: ${req.body.movieId}`);
    }
    if(movie.numberInStock === 0){
        return res.status(400).send('Movie not in stock')
    }
    //TODO fix this
    let rental = Rental.findByIdAndUpdate(req.params.id, {
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie.id,
            title: movie.title,
            dailyRental: movie.dailyRental
        }
    }, {new: true});
    if(!rental){
        return res.status(404).send('The rental with the given ID does not exist');
    }

    res.status(200).send(rental);
});

//Delete a rental
router.delete('/:id', [auth, admin], async (req,res) => {

    const rental = await Rental.findByIdAndRemove(req.params.id);
    if(!rental){
        return res.status(404).send('The rental with the given ID does not exist');
    }
    res.status(202).send(rental);
});




module.exports = router;

