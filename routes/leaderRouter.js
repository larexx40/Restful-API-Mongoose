const express= require('express')
const bodyParser=require('body-parser');
const Leaders = require('../models/leaders');
const { json } = require('express/lib/response');
const leaderRouter = express.Router()
var authenticate = require('../authenticate')

leaderRouter.use(bodyParser.json())
leaderRouter.route('/')
//get all the leaders in the database as a json file
  .get((req,res,next) => {
    Leaders.find({})
    .then((leaders) => {
      res.statusCode=200
      res.json(leaders)
    }, (err)=>next(err))
    .catch((err) =>next(err));
  })

// post leaders document
  .post(authenticate.verifyUser, (req, res, next) => {
  Leaders.create(req.body)
  .then((Leaders) => {
    res.statusCode=200
    res.json(Leaders)
    Leaders.save()
  }, (err)=>next(err))
  .catch((err) =>next(err) );
  })

  //PUT/edit cannot be performed a whole json document
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leader');
  })

  .delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.remove({})
    .then(() => {
      res.statusCode= 200
      res.end('All leaders Deleted');
    }, (err)=>next(err))
    .catch((err) => next(err));
    
  });

leaderRouter.route('/:leaderId')
.get( (req,res,next) => {
    res.end('Will send details of the leader: ' + req.params.leaderId +' to you!');
})

.post(authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})

.put(authenticate.verifyUser, (req, res, next) => {
  res.write('Updating the leaders: ' + req.params.leaderId + '\n');
  res.end('Will update the leaders: ' + req.body.name + 
        ' with details: ' + req.body.description);
})

.delete(authenticate.verifyUser, (req, res, next) => {
    res.end('Deleting leader: ' + req.params.leaderId);
});




module.exports = leaderRouter