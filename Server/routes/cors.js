const express = require('express');
const cors = require('cors');
const app = express();

//   Browser: reinforces check on CORS header to see if server allows the access to itself initiated by origin A(a site)
//   ________         ________
//  |Origin A| ----> |Origin B|

//server(origin B) will instruct the server site(browser) , to allow/restrict a particular request from origin A
const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://localhost:3001'];

var corsOptionsDelegate = (req, callback) => {
    var carsOptions;

    if (whitelist.indexOf(req.header('Origin')) != -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
}

exports.cors = cors();// Header includes *, means allow all
exports.corsWithOptions = cors(corsOptionsDelegate);// check whitelist 


