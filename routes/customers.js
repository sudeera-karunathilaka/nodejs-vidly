//Express for api's
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const {Customer, validate} = require('../models/customer');

//Get all customers
router.get('', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

//Get customer by id
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer){
        return res.status(404).send('The customer with the given ID does not exist');
    }
    res.send(customer);
});

//Create a customer
router.post('/', auth, async (req, res) => {
    
    const {error} = validate(req.body);//same as result.error
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
     });
    customer = await customer.save();
    res.status(201).send(customer);

});

//Update a customer
router.put('/:id', auth, async (req, res) => {
    const {error} = validate(req.body);//same as result.error
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            phone:req.body.phone,
            isGold: req.body.isGold
        }, 
        {new: true});
    if(!customer){
        return res.status(404).send('The customer with the given ID does not exist');
    }

    res.status(200).send(customer);
});

//Delete a customer
router.delete('/:id', [auth, admin], async (req,res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if(!customer){
        return res.status(404).send('The customer with the given ID does not exist');
    }
    res.status(202).send(customer);
});
module.exports = router;