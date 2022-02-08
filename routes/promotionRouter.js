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
      res.json(promotions)
    },(err)=>next(err))
    .catch((err) => next(err));
  })
  
  //POST all promotion documents
  .post((req, res, next) => {
    Promotions.create(req.body)
    .then((promotions) => {
      res.statusCode=200
      res.json(promotions)
    }, (err)=>next(err))
    .catch((err) =>next(err));
  })
// you cannot perform editing on the whole document
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotion');
  })

//DELETE the whole promotion json document
  .delete((req, res, next) => {
    Promotions.remove({})
    .then(() => {
      res.statusCode=200
      Promotions.save()
    }, (err)=>next(err))
    .catch((err) =>next(err));

      res.end('Deleting all promotions');
  });

// CRUD operations on a field in the document using its id as reference point
promoRouter.route('/:promoId')
.get( (req,res,next) => {
  Promotions.findById(res.params.promoId)
  .then((promotion) => {
    res.status=200
    res.json(promotion)
  }, (err)=>next(err))
  .catch((err) => next(err));
    res.end('Will send details of the promotion: ' + req.params.promoId +' to you!');
})

//findbyidaandupdate
.post( (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotion/'+ req.params.promoId);
})

.put( (req, res, next) => {
  Promotions.findByIdAndUpdate(req.params.promoId, req.body)
  .then((promotion) => {
    res.statusCode=200
    res.json(promotion)
  }, (err)=>next(err))
  .catch((err) =>next(err));
})

.delete( (req, res, next) => {
  Promotions.findByIdAndRemove(req.params.promoId)
  .then((promotion) => {
    res.statusCode=200
    res.json(promotion)
  }, (err)=>next(err))
  .catch((err) => next(err));

    res.end('Deleting promotion: ' + req.params.promoId);
});

module.exports = promoRouter