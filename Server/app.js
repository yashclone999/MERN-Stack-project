//Implementing server
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');//session middle-ware
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

//Implementing REST API
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promRouter = require('./routes/promRouter');
var uploadRouter = require('./routes/uploadRouter');
var favRouter = require('./routes/favRouter');
var commentRouter = require('./routes/commentRouter');
var feedbackRouter = require('./routes/feedbackRouter');



//setting up connection with "mogoDB server" and importing "models and schemas"
const mog = require('mongoose');

//db name: conFusion
const connect = mog.connect(config.mongoUrl);

//morgan does logging
connect.then((db) => {
    console.log(`connected to server db.\n`);
}).catch((err) => {
    console.log(err);
});



var app = express();

//redirect all request to https secure srever
//app.all('*', (req, res, next) => {
//    if (req.secure) {
//        return next();
//    } else {
//        res.redirect( 307,'https://' + req.hostname + ':' + app.get('secPort') + req.url);
//    }
//})


// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Not using session
//using "session-middleware"
//app.use(session({
//    name: 'session-id',
//    secret: '1234-5678',
//    saveUninitialized: false,
//    resave: false,
//    store: new FileStore()
//}));

//here we state that we will use passport and passport.session()
app.use(passport.initialize());


//app.use(passport.session());



/////////////////////////////////////////////////////

//Authorization//

app.use('/', indexRouter);
app.use(express.static(__dirname + '/public'));
//We do login, and do "passport.authenticate('local')": after that (req.user is mounted by passport) session
//data is filled by passport with username basically "passport" takes care of session
app.use('/users', usersRouter);

//We are using "app.use(auth)":
//Will check and only call "next" middle ware if not correct



//////////////////////////////////////////////////////





app.use('/dishes', dishRouter);
app.use('/promotions', promRouter);
app.use('/upload', uploadRouter);
app.use('/favorites', favRouter);
app.use('/comments', commentRouter);
app.use('/feedback', feedbackRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
