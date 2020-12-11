const express = require('express');
const bodyparser = require('body-parser');
const mini_router = express.Router();
mini_router.use(bodyparser.json());

// "all" applies to any "verb": {get, put, delete} of REST API
mini_router.route('/').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    next();//calling this passes on the modified object in this function to next operation ...(i), (ii), (iii), (iv)

}).get((req, res, next) => {
    //...(i)

    res.end('Sending all dishes as GET request');
}).post((req, res, next) => {
    //...(ii)

    res.end("will add this string " + req.body.name + ', with details ' + req.body.description);
}).put((req, res, next) => {
    //...(iii)

    res.statusCode = 403;
    res.end("Not supported!");
}).delete((req, res, next) => {
    //...(iv)

    res.end("DELETE ALL!");
});



mini_router.route('/:dishID').all((req, res, next) => {

    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    next();//calling this passes on the modified object in this function to next operation ...(i), (ii), (iii), (iv)

}).get((req, res, next) => {

    res.end("Sending dish no. " + req.params.dishID + " as GET request");

}).post((req, res, next) => {

    res.statusCode = 403;
    res.end("Not supported!");

}).put((req, res, next) => {

    res.write("Will update dish no. " + req.params.dishID + "\n");
    res.end("\nwill update " + req.body.name + ', with details ' + req.body.description);

}).delete((req, res, next) => {

    res.end("DELETE dish no. " + req.params.dishID);

});