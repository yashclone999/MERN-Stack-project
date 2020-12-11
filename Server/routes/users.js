var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');//for authentication
const User = require('../models/user');
const authenticate_module = require('../authenticate');
const cors = require('./cors');
router.use(bodyParser.json());



router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate_module.verifyUser, authenticate_module.verifyAdmin, function (req, res, next) {
    User.find({})
        .then((user) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(user);
        }, (err) => next(err)

        ).catch((err) => next(err));
});

//First signup before login, to put data "credentials" in db
router.post('/signup', cors.corsWithOptions,  function (req, res, next) {

    //check for duplicate user name
    //use "register" meathod of "passport-local-mongoose"
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {

        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-type', 'application/json');
            res.json({ err: err });

        } else {

            if (req.body.firstname) {
                user.firstname = req.body.firstname;
            }
            if (req.body.lastname) {
                user.lastname = req.body.lastname;
            }
            user.save((err, user) => {

                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-type', 'application/json');
                    res.json({ err: err });
                }

                //reconfirm if user was signed up by authenticating using 'local' strategy
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json({ Success: true, status: 'Registration Successful!' });
                });



            });
        }
    });
});


//after signup, login to issue "jwt-token"
//we will use PASSPORT.AUTHENTICATE() 
//PASSPORT.AUTHENTICATE('local')  automatically uploads/mounts "user" to request "req" on successful authentication
//after this verification will happen using tokens..i.e. "verifyUser" function
router.post('/login', cors.corsWithOptions, (req, res, next) => {

    //authenticate
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }


        //in this case its not an error but user or password doesnt exist, so this case is diff from the one below
        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-type', 'application/json');
            res.json({ success: false, status: 'Login Unsuccessful!', err: info }); 
        }

        //passport.authenticate will add "req.logIn"
        req.logIn(user, (err) => {
            if (err) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!' });
            }

            //issue token
            var token = authenticate_module.getToken({ _id: req.user._id });
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json({ Success: true, token: token, status: 'Logged IN!' }); 
        }); 
        

    })(req, res, next);
    
});


router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
    if (req.user) {

        //after express server connects with facebook server and does its user identity checks, (i.e. when passport.authenticate('facebook-token') is successfull )
        //express server issues a token to our web app/client
        var token = authenticate_module.getToken({ _id: req.user._id });
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({ Success: true, token: token, status: 'Logged IN!' });
    }
});


//rest endpoint to check if jwt token is still valid
router.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err)
            return next(err);

        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            return res.json({ status: 'JWT invalid!', success: false, err: info });
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({ status: 'JWT valid!', success: true, user: user });

        }
    })(req, res);
});
module.exports = router;




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////













//router.get('/logout', (req, res, next) => {
//    if (req.session ) {
//        req.session.destroy();
//        res.clearCookie('session-id');
//        res.redirect('/');
//    } else {
//        var err = new Error("you r not loggedin!");
//        err.status = 403;
//        next(err);
//    }
//});



//LOGIN WITHOUT USING "PASSPORT"
//router.post('/login', (req, res, next) => {

//    if (!req.session.user_name) {

//        var authHeader = req.headers.authorization;

//        if (authHeader == null) {
//            var err = new Error("Not authorized!");
//            res.setHeader('WWW-Authenticate', 'Basic');
//            err.status = 401;
//            return next(err);
//        }

//        var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//        var username = auth[0];
//        var password = auth[1];


//        //retrieving from db
//        User.findOne({ username: username }).then((user) => {
//            if (user === null) {

//                var err = new Error("User doesnt Exists!");
//                err.status = 403;
//                return next(err);

//            } else if (user.password != password) {

//                var err = new Error("Password doesnt match!");
//                err.status = 403;
//                return next(err);

//            } else if (user.username === username && user.password === password) {

//                //setting up session
//                req.session.user_name = 'authenticated';
//                res.statuscode = 200;
//                res.setHeader('Content-type', 'text/plain');
//                res.end("You are cool!");
//            }

//        });

//    }

//    else {
//        if (req.session.user_name === 'authenticated') {
//            res.end("You are cool!");
//        } else {
//            var err = new Error("Not authorized!");
//            err.status = 401;
//            return next(err);
//        }
//    }
//});