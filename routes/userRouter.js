var express = require('express');
const bodyParser = require('body-parser')
const Users = require('../models/users');

var userRouter = express.Router();
userRouter.use(bodyParser.json())



/* GET users listing. */
userRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//register username and password
userRouter.post('/signup' , (req , res, next)=>{
  Users.findOne({username: req.body.username})
  .then((user) => {
    if (user == null) {
      Users.create({
        username: req.body.username,
        password: req.body.password
      })
      .then((user) => {
        res.statusCode = 200
        res.json({status: 'Registration Successful', user: user})
      }, (err)=>next(err))
    } else {
      var err = new Error('Username ' +req.body.username + ' already exist')
      err.status = 403
      next(err)
    }
  }, (err)=>next(err))
  .catch((err) =>next(err));
})

//do basic authetication, and validate username and password from db
userRouter.post('/login' , (req , res, next)=>{
  //if he is not an autorized user from the stored session, hence pass through the basic authentication
  if (!req.session.user) {
    var authHeader = req.headers.authorization
    if (!authHeader) {
      var err = new Error('You are not Authenticated')
      err.status=401
      res.setHeader('WWW-Authenticate', 'Basic')
      next(err)
    }
    //validate your authorization header
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
    var username = auth[0]
    var password = auth[1]

    //validate the header with database
    Users.findOne({username: username})
    .then((user) => {
      if (user.username===null) {
        var err = new Error('Username ' + user.username +'does not exixt')
        err.status =403
        return next(err)
      }
      else if (user.password !== password) {
        var err = new Error('your password is not correct')
        err.status=403
        return next(err)
      }
      else if (user.username== username && user.password== password) {
        req.session.user = 'authenticated'
        res.statusCode= 200
        //res.setHeader('Content-Type', 'text/plain')
        res.end('You are authenticated')
        next()//i.eauthorized, then execute next program
      }
    })
    .catch((err) =>next(err));
  }
  else{
    res.statusCode=200
    res.setHeader('Content-Type', 'text/plain')
    res.end('you are already authenticated')
  } 
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
