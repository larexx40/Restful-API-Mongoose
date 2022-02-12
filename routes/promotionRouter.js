const bodyParser = require("body-parser");
const express = require("express");
const Promotions = require("../models/promotions");
const promoRouter = express.Router()
const authenticate = require('../authenticate')

promoRouter.use(bodyParser.json())
promoRouter.route('/')
//perform CRUD operation by authenticated user except get
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
  .post(authenticate.verifyUser, (req, res, next) => {
    Promotions.create(req.body)
    .then((promotions) => {
      res.statusCode=200
      res.json(promotions)
    }, (err)=>next(err))
    .catch((err) =>next(err));
  })
// you cannot perform editing on the whole document
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotion');
  })

//DELETE the whole promotion json document
  .delete(authenticate.verifyUser, (req, res, next) => {
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
})

//findbyidaandupdate
.post(authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotion/'+ req.params.promoId);
})

.put(authenticate.verifyUser, (req, res, next) => {
  Promotions.findByIdAndUpdate(req.params.promoId, req.body)
  .then((promotion) => {
    res.statusCode=200
    res.json(promotion)
  }, (err)=>next(err))
  .catch((err) =>next(err));
})

.delete(authenticate.verifyUser, (req, res, next) => {
  Promotions.findByIdAndRemove(req.params.promoId)
  .then((promotion) => {
    res.statusCode=200
    res.json(promotion)
  }, (err)=>next(err))
  .catch((err) => next(err));
});

promoRouter.route('/:promoId')
.get( (req,res,next) => {
  Promotions.findById(res.params.promoId)
  .then((promotion) => {
    res.status=200
    res.json(promotion)
  }, (err)=>next(err))
  .catch((err) => next(err));
})

//findbyidaandupdate
.post(authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotion/'+ req.params.promoId);
})

.put(authenticate.verifyUser, (req, res, next) => {
  Promotions.findByIdAndUpdate(req.params.promoId, req.body)
  .then((promotion) => {
    res.statusCode=200
    res.json(promotion)
  }, (err)=>next(err))
  .catch((err) =>next(err));
})

.delete(authenticate.verifyUser, (req, res, next) => {
  Promotions.findByIdAndRemove(req.params.promoId)
  .then((promotion) => {
    res.statusCode=200
    res.json(promotion)
  }, (err)=>next(err))
  .catch((err) => next(err));
});

module.exports = promoRouter