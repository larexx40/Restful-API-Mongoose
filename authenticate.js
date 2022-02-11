var passport = require('passport')
var LocalStrategy=require('passport-local').Strategy
var User = require('./models/users')

exports.local = passport.use(new LocalStrategy(User.authenticate()))

//using session to track login
//use serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
