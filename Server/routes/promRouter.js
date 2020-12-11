const mog = require('mongoose');
const Proms = require("../models/promotions");

const express = require("express");
const bodyparser = require('body-parser');
const mini_router = express.Router();
mini_router.use(bodyparser.json());

const authenticate = require('../authenticate');
const cors = require('./cors');

mini_router.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200; })
    .get( cors.cors,(req, res, next) => {

        Proms.find(req.query).then( (all) => {

            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(all);

        }, (err) => next(err)

        ).catch((err) => next(err));

    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

        Proms.create(req.body).then((prom) => {

            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(prom);

        }, (err) => next(err)

        ).catch((err) => next(err));

    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

        Proms.deleteMany({}).then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(resp);

        }, (err) => next(err)

        ).catch((err) => next(err));

    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("Not supported!");
    });


//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


mini_router.route('/:promID')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200; })
    .get(cors.cors, (req, res, next) => {

        Proms.findById(req.params.promID).then((prom) => {

            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(prom);

        }, (err) => next(err)

        ).catch((err) => next(err));

    })
    .post(cors.corsWithOptions, (req, res, next) => {

        res.statusCode = 403;
        res.end("Not supported!");

    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

        Proms.findByIdAndRemove(req.params.promID)
            .then((resp) => {

                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(resp);

            }, (err) => next(err)

            ).catch((err) => next(err));

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

        Proms.findByIdAndUpdate(req.params.promID, { $set: req.body }, { new: true })
            .then((prom) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(prom);

            }, (err) => next(err)

            ).catch((err) => next(err));

    });

module.exports = mini_router;