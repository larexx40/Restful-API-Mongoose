const bodyParser = require("body-parser");
const express = require("express");
const Promotions = require("../models/promotions");
const promoRouter = express.Router()

promoRouter.use(bodyParser.json())
promoRouter.route('/')
// GET all document in json format
  .get((req,res,next) => {
    Promotions.find({})
    .then((promotions) => {
      res.statusCode=200
      res.end("<html><body><h1>VIEW Promotions document </h1></body></html>")
      res.json(promotions)
    },(err)=>next(err))
    .catch((err) => next(err));
  })
  
  //POST all promotion documents
  .post((req, res, next) => {
    Promotions.create(req.body)
    .then((promotions) => {
      res.statusCode=200
      res.end("<html><body><h1>Promotions document created</h1></body></html>")
      res.json(promotions)
    }, (err)=>next(err))
    .catch((err) =>next(err));
   res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
  })
// you cannot perform editing on the whole document
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotion');
  })

  //DELETE the whole promotion json document
  .delete((req, res, next) => {
    Promotions.remove()
    .then(() => {
      res.statusCode=200
      Promotions.save()
    }, (err)=>next(err))
    .catch((err) =>next(err));

      res.end('Deleting all promotions');
  });

promoRouter.route('/:promoId')
.get( (req,res,next) => {
    res.end('Will send details of the promotion: ' + req.params.promoId +' to you!');
})

.post( (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotion/'+ req.params.promoId);
})

.put( (req, res, next) => {
  res.write('Updating the promotion: ' + req.params.promoId + '\n');
  res.end('Will update the promotion: ' + req.body.name + 
        ' with details: ' + req.body.description);
})

.delete( (req, res, next) => {
    res.end('Deleting promotion: ' + req.params.promoId);
});

module.exports = promoRouter