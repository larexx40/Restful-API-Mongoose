var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/userRouter');
var dishRouter = require('./routes/dishRouter')
var leaderRouter = require('./routes/leaderRouter')
var promotionRouter = require('./routes/promotionRouter')

//Express-session to handle authentication
var session = require('express-session')
var FileStore = require('session-file-store')(session)

// MongoDB connect
const mongoose = require('mongoose')
const Dishes = require('./models/dishes');
const url = 'mongodb://localhost:27017/confusion'
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

//to use cookie parse require a sign key
//app.use(cookieParser('12347890'));
//using express-session instead of signed cookie
app.use(session({
  name: 'session-id',
  secret: '12347890',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}))

//load homepage first, then userRouter for login/logout/reg
//get authenticated first before access to other router
app.use('/', indexRouter);
app.use('/users', userRouter);

//using cookies for authetication
function auth(req, res, next){
  console.log(req.session);
  //if the user has no signed cookies in its request header, 
  //he is not autorized, hence pass through the basic authentication
  if (!req.session.user) {
    var err = new Error('You are not Authenticated')
    err.status=403
    //res.setHeader('WWW-Authenticate', 'Basic')
    return next(err)
  }
  else{
    if (req.session.user === 'authenticated') {
      next()
    }
    else{
      var err = new Error('You are not authenticated')
      err.status=403
      return next(err)
    }
  }
}
    

//autorization first before he load other router
app.use(auth)
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