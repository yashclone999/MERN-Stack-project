const mog = require('mongoose');
const Dishes = require('../models/dishes');
const Comments = require('../models/comments');

const express = require('express');
const bodyparser = require('body-parser');
const mini_router = express.Router();
mini_router.use(bodyparser.json());

const authenticate = require('../authenticate');
const cors = require('./cors');



mini_router.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200; })
    .get(cors.cors, (req, res, next) => {

        Comments.find(req.query)
            .populate('author')
            .then((comments) => {

                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(comments);

            }, (err) => next(err)

            ).catch((err) => next(err));

    })


    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        if (req.body != null) {
            req.body.author = req.user._id;
            Comments.create(req.body)
                .then((comment) => {
                    Comments.findById(comment._id)
                        .populate('author')
                        .then((comment) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(comment);
                        })
                }, (err) => next(err))
                .catch((err) => next(err));
        }
        else {
            err = new Error('Comment not found in request body');
            err.status = 404;
            return next(err);
        }
    })


    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

        Comments.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err)); 

    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /comments/');
    });


//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


mini_router.route('/:commentID')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200; })

    .get(cors.cors, (req, res, next) => {

        Comments.findById(req.params.commentId)
            .populate('author')
            .then((comment) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(comment);
            }, (err) => next(err))
            .catch((err) => next(err));

    })
    .post((req, res, next) => {

        res.statusCode = 403;
        res.end("Not supported!");

    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        //////////////
        Comments.findById(req.params.commentId)
            .then((comment) => {
                if (comment != null) {
                    if (!comment.author.equals(req.user._id)) {
                        var err = new Error('You are not authorized to delete this comment!');
                        err.status = 403;
                        return next(err);
                    }
                    Comments.findByIdAndRemove(req.params.commentId)
                        .then((resp) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(resp);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
        //////////////


        

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

       Comments.findById(req.params.commentId)
       .then((comment) => {
            if (comment != null) {
                if (!comment.author.equals(req.user._id)) {
                    var err = new Error('You are not authorized to update this comment!');
                    err.status = 403;
                    return next(err);
                }
                req.body.author = req.user._id;
                Comments.findByIdAndUpdate(req.params.commentId, {
                    $set: req.body
                }, { new: true })
                    .then((comment) => {
                        Comments.findById(comment._id)
                            .populate('author')
                            .then((comment) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(comment);
                            })
                    }, (err) => next(err));
            }
            else {
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
            .catch((err) => next(err));

    });

module.exports = mini_router;