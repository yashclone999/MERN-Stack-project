const mog = require('mongoose');
const express = require('express');
const parser = require('body-parser');


const Dishes = require('../models/dishes');
const Users = require('../models/user');
const Favorites = require('../models/favorites');

const favRouter = express.Router();
favRouter.use(parser.json());

const authenticate = require('../authenticate');
const cors = require('./cors');


favRouter.route('/')
    .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus = 200; })

    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Favorites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes._id')
            .then((favorites) => {
                if (!favorites) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json(favorites);
                }
                else {

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json(favorites);

                }

            }, (err) => next(err))
            .catch((err) => next(err))

    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Favorites.findOne({ user: req.user._id }, (err, fav) => {

            if (err) { return next(err); }

            if (fav == null) {

                Favorites.create({ user: req.user._id })
                    .then((Fav) => {

                        for (i = 0; i < req.body.length; i++) {
                            if (Fav.dishes.indexOf(req.body[i]) < 0) {
                                Fav.dishes.push(req.body[i]);
                            }
                        }
                        Fav.save()
                            .then((favorite) => {
                                Favorites.findById(favorite._id)
                                    .populate('user')
                                    .populate('dishes._id')
                                    .then((favorite) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(favorite);
                                    })
                            })
                            .catch((err) => {
                                return next(err);
                            });
                    })
            }
            else {

                //STILL NEED TO IMPLEMENT THE PREVENTION OF FORGERY (DUPLICATE FAVORITE!!)
                for (i = 0; i < req.body.length; i++) {
                    if (fav.dishes.indexOf(req.body[i]) < 0) {
                        fav.dishes.push(req.body[i]);
                    }
                }
                fav.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                            .populate('user')
                            .populate('dishes._id')
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            })
                    })
                    .catch((err) => {
                        return next(err);
                    });
            }
        })

    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Favorites.findOne({ user: req.user._id })
            .then((fav) => {

                if (fav == null) {

                    err = new Error('Your Favorites doesn\'t exist, please create one!');
                    err.statusCode = 404;
                    return next(err);//handlled in app.js

                }
                else {

                    fav.dishes.push(req.body);
                    fav.save().then((updated_fav) => {

                        Favorites.findOne({ user: updated_fav.user._id })
                            .populate('user')
                            .populate('dishes._id')
                            .then((fav) => {

                                if (fav != null) {
                                    res.statusCode = 200;
                                    res.setHeader('Content-type', 'application/json');
                                    res.json(fav);
                                }
                                else {
                                    err = new Error('No favorites found!');
                                    err.statusCode = 404;
                                    return next(err);//handlled in app.js
                                };

                            }, (err) => next(err)).catch((err) => next(err));

                    });
                }
            })
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Favorites.findOne({ user: req.user._id })
            .then((fav) => {
                if (fav != null) {
                    for (let i = (fav.dishes.length - 1); i >= 0; i--) {
                        fav.dishes.id(fav.dishes[i]._id).remove();
                    }
                }
                fav.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                            .populate('user')
                            .populate('dishes._id')
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            })
                    })
                    .catch((err) => {
                        return next(err);
                    });



            });

    })
        ////////////////////////////////////////////////////////////////////////////

        favRouter.route('/:dishId')
            .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus = 200; })

            .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

                Favorites.findOne({ user: req.user._id })
                    .populate('user')
                    .populate('dishes._id')
                    .then((favorites) => {
                        if (!favorites) {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            return res.json(favorites);
                        }
                        else {
                            if (!favorites.dishes.id(req.params.dishId)) {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                return res.json(favorites);
                            }
                            else {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                return res.json(favorites);
                            }
                        }

                    }, (err) => next(err))
                    .catch((err) => next(err))
            })

            .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
                Favorites.findOne({ user: req.user._id }, (err, fav) => {

                    if (err) { return next(err); }
                    if (fav == null) {

                        Favorites.create({ user: req.user._id })
                            .then((Fav) => {
                                if (!Fav.dishes.indexOf( { "_id": req.params.dishId } ) < 0) {

                                    Fav.dishes.push({ "_id": req.params.dishId });
                                    Fav.save()
                                        .then((favorite) => {
                                            Favorites.findById(favorite._id)
                                                .populate('user')
                                                .populate('dishes._id')
                                                .then((favorite) => {
                                                    res.statusCode = 200;
                                                    res.setHeader('Content-Type', 'application/json');
                                                    res.json(favorite);
                                                })
                                        })
                                        .catch((err) => {
                                            return next(err);
                                        });
                                }
                                

                                
                            })
                    }
                    else {
                        fav.dishes.push({ "_id": req.params.dishId });
                        fav.save()
                            .then((favorite) => {
                                Favorites.findById(favorite._id)
                                    .populate('user')
                                    .populate('dishes._id')
                                    .then((favorite) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(favorite);
                                    })
                            })
                            .catch((err) => {
                                return next(err);
                            });
                    }
                })
            })


            .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

                Favorites.findOne({ user: req.user._id })
                    .then((fav) => {

                        if (fav != null) {

                            if (fav.dishes.id(req.params.dishId) != null) {

                                fav.dishes.id(req.params.dishId).remove();
                                fav.save().then((updated_fav) => {

                                    Favorites.findOne({ user: updated_fav.user._id })
                                        .populate('user')
                                        .populate('dishes._id')
                                        .then((fav) => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-type', 'application/json');
                                            res.json(fav);
                                        }, (err) => next(err)).catch((err) => next(err));

                                });

                            }
                        }
                    }, (err) => next(err)

                    ).catch((err) => next(err));

            });

    


module.exports = favRouter;