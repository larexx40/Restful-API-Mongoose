var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/userRouter');
var dishRouter = require('./routes/dishRouter')
var leaderRouter = require('./routes/leaderRouter')
var promotionRouter = require('./routes/promotionRouter')


//passport to handle authentication
const passport = require('passport');
const authenticate = require('./authenticate')
//add the config file
const config = require('./config');



// MongoDB connect
const mongoose = require('mongoose')
const url = config.mongoUrl;
const connect = mongoose.connect(url)

connect.then((db)=>{
  console.log('Connected to mongo server correctly');
}, (err)=>{console.log(err);})


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//initialize passport and session
app.use(passport.initialize())

//load homepage first, then userRouter for login/logout/reg
//get authenticated first before access to other router
app.use('/', indexRouter);
app.use('/users', userRouter);

app.use(express.static(path.join(__dirname, 'public')));

// Router setup
app.use('/dishes', dishRouter)
app.use('/leaders', leaderRouter)
app.use('/promotions', promotionRouter)

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