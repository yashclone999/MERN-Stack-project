var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');


//supply with a verification function to LocalStrategy: use function provided by plugin passportLocalMongoose : "User.authenticate()"
//You can write your own function for verification instead of "User.authenticate()"
exports.local = passport.use( new LocalStrategy( User.authenticate() ) );


//since we use sessions we need serialize: User.deserializeUser(), User.serializeUser() are provided by "passport-local-mongoose" plugin
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//SHIT for implementing token:

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config');

//"user" : the json payload (issuing token) not extracting token
exports.getToken = function (body) {
    return jwt.sign(body, config.secretKey, { expiresIn: 3600 });
}

var options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = config.secretKey;


//implementing "jwt strategy"
exports.jwtPassport = passport.use(new JwtStrategy(options,
    (jwt_payload, done) => {
        console.log(`JWT payload: ${jwt_payload}`);
        User.findOne({_id: jwt_payload._id }, (err, user) => {

            if (err) {
                return done(err, false);
            } else if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    })
);

//using "jwt strategy" in "passport"
//as we use this function() "verifyUser", it authenticates and if successful, it adds user data
//after extracting token, and adds it as "req.user"  DAMMM..!!
exports.verifyUser = passport.authenticate('jwt', { session: false });


//Custom verfy admin :
exports.verifyAdmin = (req, res, next) => {
    User.findOne({ _id: req.user._id }, (err, user) => {
        if (err) {
            var err = new Error('User Not Found!');
            err.status = 401;
            return next(err);
        } else {
            if (user.admin === true) {
                next();
            } else {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
        }   
    })
};



//////////////////////////////////////////////////// for OAUTH 2 using facebook

var FacebookTokenStrategy = require('passport-facebook-token');

exports.facebookPassport = passport.use(new FacebookTokenStrategy(
    {
        clientID: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret

    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({ facebookId: profile.id }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (!err && user !== null) {
                return done(null, user);
            } else {
                user = new User({ username: profile.displayName });
                user.facebookId = profile.id;
                user.firstname = profile.name.givenName;
                user.lastname = profile.name.familyName;
                user.save((err, user) => {
                    if (err) {
                        return done(err, false);
                    }
                    else {
                        return done(null, user);
                    }
                })
            }
        });
    }
));




























////////////////////////////////////////////////////////////////////////////////////////////

//function verifyToken(req, res, next) {
//    const bearerHeader = req.headers['authorization'] || req.query.token || req.headers['Authorization'];

//    if (bearerHeader) {
//        const bearer = bearerHeader.split(' ');
//        const bearerToken = bearer[1];
//        req.token = bearerToken;
//        next();
//    } else {
//        // Forbidden
//        res.sendStatus(403);
//    }
//}

