//mini express router to handle "dish" and "dishID"

const mog = require('mongoose');
const Dishes = require('../models/dishes');

const express = require('express');
const bodyparser = require('body-parser');
const mini_router = express.Router();
mini_router.use(bodyparser.json());

const authenticate = require('../authenticate');
const cors = require('./cors');



mini_router.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200;})
    .get(cors.cors, (req, res, next) => {

        //Collection.find({}).populate("what to populate") this fills up the field which is referring to someone else  
        //req.query will contain "featured: true"
        Dishes.find(req.query)
            .populate('comments.author')
            .then((all) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(all);
        }, (err) => next(err)

        ).catch((err) => next(err));

    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

        Dishes.create(req.body).then((dish) => {
            console.log(`Dish created : ${dish}`);
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(dish);
        }, (err) => next(err)

        ).catch((err) => next(err));

    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

        Dishes.deleteMany({}).then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(resp);
        }, (err) => next(err)

        ).catch((err) => next(err));

    })
    .put( (req, res, next) => {
        res.statusCode = 403;
        res.end("Not supported!");
    });


//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


mini_router.route('/:dishID')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200; })
    .get(cors.cors,(req, res, next) => {

        Dishes.findById(req.params.dishID)
            .populate('comments.author')
            .then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            //res.end("Sending dish no. " + req.params.dishID + " as GET request");
            res.json(dish);
        }, (err) => next(err)

        ).catch((err) => next(err));

    })
    .post(cors.corsWithOptions, (req, res, next) => {

        res.statusCode = 403;
        res.end("Not supported!");

    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

        Dishes.findByIdAndRemove(req.params.dishID)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                //res.end("DELETED!");
                res.json(resp);
        }, (err) => next(err)

        ).catch((err) => next(err));

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

        Dishes.findByIdAndUpdate( req.params.dishID, { $set: req.body }, { new: true } )
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                //res.end("Updated " + req.body.name);
                res.json(dish);
        }, (err) => next(err)

        ).catch((err) => next(err));

    });

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX




module.exports = mini_router;