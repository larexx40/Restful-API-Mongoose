var passport = require('passport')
var LocalStrategy=require('passport-local').Strategy
var User = require('./models/users')

//import passport-jwt and jwt module
var JwtStrategy = require('passport-jwt').Strategy
var  ExtractJwt = require('passport-jwt').ExtractJwt
var jwt = require('jsonwebtoken')
var config = require('./config')

var FacebookTokenStrategy = require('passport-facebook-token')

exports.local = passport.use(new LocalStrategy(User.authenticate()))

//using session to track login
//use serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//create token with jasonwebtoken
exports.getToken = (user)=>{
    return jwt.sign(user, config.secretKey, {expiresIn: 3700})
}

//configure the passport-jwt
var opts ={}
opts.jwtFromRequest =  ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done)=>{
        console.log('JWT payload', jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user)=>{
            if (err){
                return done(err, false)
            }
            else if (user){

                return done(null, user)
            }
            else{
                return done(null, false)
            }
        })
    }));

//to authenticate request using jwt as the strategy
exports.verifyUser = passport.authenticate('jwt',{session: false})

//verify if it is an admin
exports.verifyAdmin = (req, res, next)=>{
    console.log(req.user);
    if(req.user && req.user.admin){
        return next()
    }
    return res.status(401).json({err: "You are not an ADMIN "})

}

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done)=>{
    User.findOrCreate({facebookId: profile.id}, (err, user)=>{
        if (err){
            return done(err, false)
        }
        if(!err && user !== null){
            //already registered with oauth2
            return done(null, user)
        }
        else{
            user = new User({username: profile.displayName});
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user)=>{
                if (err)
                    return done(err, false)
                else
                    return done(null, user)
            })
        }
    })
}))