
const Feedbacks = require('../models/feedback');

const express = require('express');
const bodyparser = require('body-parser');
const mini_router = express.Router();
mini_router.use(bodyparser.json());

const authenticate = require('../authenticate');
const cors = require('./cors');



mini_router.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200; })
    .get(cors.cors, (req, res, next) => {
        

        Feedbacks.find()
            .then((all) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(all);
            }, (err) => next(err)

            ).catch((err) => next(err));

    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Feedbacks.create(req.body).then((feedback) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(feedback);
        }, (err) => next(err)

        ).catch((err) => next(err));
        

    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (res, next) => {

        Feedbacks.deleteMany({}).then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(resp);
        }, (err) => next(err)

        ).catch((err) => next(err));

    })



//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX




module.exports = mini_router;