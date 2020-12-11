const express = require('express');
const bodyparser = require('body-parser');
const mini_router = express.Router();
mini_router.use(bodyparser.json());

const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');


//storage configurations for multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images');
    },

    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

//filter for type of files to be uploaded
const extensionFileFilter = (req, file, callback) => {

    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/) ) {
        return callback(new Error("Only images allowed!"), false);
    }
    callback(null, true);
     
};

const upload = multer({ storage: storage, fileFilter: extensionFileFilter });



mini_router.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200; })
    .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("Not supported!");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("Not supported!");
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("Not supported!");
    })//upload.single('imageFile'): reffers to the form-label, at the client side
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
    })


module.exports = mini_router;