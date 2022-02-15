var express = require('express');
const bodyParser = require('body-parser')
const Users = require('../models/users');
const passport = require('passport');

//to create authentication token
var authenticate= require('../authenticate')

var userRouter = express.Router();
userRouter.use(bodyParser.json())



/* GET users listing. */
userRouter.get('/', (req, res, next)=> {
Users.find({})
.then((users)=>{
  res.statusCode=200
  console.log('display registered user');
  res.setHeader('Content-Type', 'application/json')
  res.json(users)
  
}, (err)=>next(err))
.catch((err)=>next(err))
})

//register username and password
//first verify if username exist
userRouter.post('/signup' , (req , res, next)=>{
  Users.register(new Users({username: req.body.username}), 
  req.body.password, (err, user)=>{
    if (err) {
      res.statusCode=500
      res.setHeader('Conent-Type', 'application/json')
      res.json({err: err})
    } else {
      //include firstname and password in your body
      if (req.body.firstname) 
        user.firstname= req.body.firstname
      if (req.body.lastname)
        user.lastname= req.body.lastname;
      user.save((err, user)=>{
        if(err){
          res.statusCode=500
          res.setHeader('Conent-Type', 'application/json')
          res.json({err: err})
          return;
        } 
        passport.authenticate('local')(req, res, ()=>{
          res.statusCode=200
          res.json({success: true, status: "Registration Successful"})
        })      
      })
     
    }
  })
})

//do basic authetication, and validate username and password from db
userRouter.post('/login', passport.authenticate('local') , (req , res)=>{
  
  //after login, a token will be generated
  var token = authenticate.getToken({_id: req.user._id, admin: req.user.admin})
  res.statusCode=200
  console.log('welcome user ' +req.user.username)
  res.setHeader('Content-Type', 'text/plain')
  res.json({success: true, token: token, status: 'you are succesfully Logged in'})
   
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
