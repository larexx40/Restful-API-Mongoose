var express = require('express');
const bodyParser = require('body-parser')
const Users = require('../models/users');
const passport = require('passport');

var userRouter = express.Router();
userRouter.use(bodyParser.json())



/* GET users listing. */
userRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//register username and password
userRouter.post('/signup' , (req , res, next)=>{
  Users.register(new Users({username: req.body.username}), 
  req.body.password, (err, user)=>{
    if (err) {
      res.statusCode=500
      res.setHeader('Conent-Type', 'application/json')
      res.json({err: err})
    } else {
      passport.authenticate('local')(req, res, ()=>{
        res.statusCode=200
        res.json({success: true, status: "Registration Successful"})
      })
    }
  })
})

//do basic authetication, and validate username and password from db
userRouter.post('/login', passport.authenticate('local') , (req , res)=>{
    res.statusCode=200
    res.setHeader('Content-Type', 'text/plain')
    res.end('you are succesfully Logged in')
   
})

userRouter.get('/logout',(req, res, next)=>{
  if (req.session) {
    req.session.destroy()
    res.clearCookie('session-id')
    res.redirect('/')
  }
  else{
    var err = new Error('You are not logged in!')
    err.status = 403
    next(err)
  }
})

module.exports = userRouter;
