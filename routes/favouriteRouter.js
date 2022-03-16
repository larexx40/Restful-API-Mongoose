const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');

const mongoose = require('mongoose');
const Favourites = require('../models/favourites');

const favouriteRouter = express.Router();
favouriteRouter.use(bodyParser.json());

//get favdish where userid ===
favouriteRouter.route('/')
.get((req, res, next)=>{
    Favourites.findOne({user: req.user._id})
    .then((userFavouriteDishes) => {
        if(userFavouriteDishes== null){
            res.send("you have no favourite dishes")
        }else{
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(userFavouriteDishes)
        }
    }).catch((err) => {next(err)});
})

//verify if exist
.post(authenticate.verifyUser, (req, res, next)=>{
    Favourites.findOne({user: req.user._id}, (err, favourites)=>{
        if(err){
            return next(err)
        }
        if(!favourites){
            favourites.create({user: req.user._id})
            .then((favourite) => {
                for(i=0; i< req.body.length; i++){
                    favourite.dishes.push(req.body.length[i]);
                }
                favourite.save()
                .then((favourite)=>{
                    res.status(200).json({"status": "favourite dish created", "favourite": favourite})
                })
            }, (err)=>next(err))
            .catch((err) => next(err));
        }
        if(favourites){
            //search if dish exist (prompt exist) else save
            for(i=0; i< req.body.length; i++){
                if(favourites.dishes.indexOf(req.body.length[i]) >= 0){
                    console.log({"exist": true, "favourite ": req.body.length[i]})
                    res.status(200)
                }else{
                    favourites.dishes.push(req.body.length[i]);
                }
                favourites.save()
                .then((favourite)=>{
                    res.status(200).json({"status": "favourite dish created", "favourite": favourite})
                }, (err)=>next(err))
                .catch((err) => next(err));
            }
        }
    })
    
 })

.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favourites');
})

//delete only dishes with Fav.user == req.user
.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
   Favourites.findOneAndRemove({user: req.user._id}, (err, result)=>{
       res.status(200).json({"status": "favourite dish deleted", result: result})
   })
});

//return particular dish if exist else not user favourite
favouriteRouter.route('/:dishId')
.get(authenticate.verifyUser, (req, res)=>{
    Favourites.findOne({user: req.user._id})
    .then((favourites)=>{
      if(!favourites){
        res.status(200).json({"exist": false, "favourites": favourites})
      }else{
        if(favourites.dishes.indexOf(req.params.dishId) < 0){
            res.status(200).json({"exist": false, "favourites": favourites})
        }else{
            res.status(200).json({"exist": true, "favourites": favourites})
        }
      }
    }, (err)=> next(err))
    .catch((err)=>next(err))
  })
//check if particular dish exist else save
.post(authenticate.verifyUser, (req, res)=>{
   Favourites.findOne({user: req.user._id}, (err, favourites)=>{
    if(err){
        return next(err)
    }
    if(!favourites){
        favourites.create({user: req.user._id})
        .then((favourite) => {
            favourites.dishes.push({"_id": req.params._id})
            favourite.save()
            .then((favourite)=>{
                res.status(200).json({"status": "favourite dish created", "favourite": favourite})
            })
        }, (err)=>next(err))
        .catch((err) => next(err));
    }
    if(favourites){
        //search if dish exist (prompt exist) else save
        for(i=0; i< req.body.length; i++){
            if(favourites.dishes.indexOf(req.body.length[i]) >=0 ){
                console.log({"exist": true, "favourite ": req.body.length[i]})
                res.status(200)
            }else{
                favourites.dishes.push(req.body.length[i]);
            }
            favourites.save()
            .then((favourite)=>{
                res.status(200).json({"status": "favourite dish created", "favourite": favourite})
            }, (err)=>next(err))
            .catch((err) => next(err));
        }
    }
   })
})

.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favourites/dishId');
})


//delete particular dish from db
.delete(authenticate.verifyUser, (req, res, next)=>{
    Favourites.findOne({user: req.user._id}, (err, favourites)=>{
        if(err){
            return next(err);
        }
        if(!favourites){
            res.status(200).json({"status": "favourite dish empty", "favourite": favourites})
        }
        if(favourites){
         var favouriteIndex = favourites.dishes.indexOf(req.params._id) 
         if(favouriteIndex >= 0) {
             favourites.dishes.splice(favouriteIndex, 1);
             favourites.save()
             .then((favourite)=>{
                res.status(200).json({"status": "favourite dish deleted ", "favourite": favourite})
            }, (err)=>next(err))
            .catch((err) => next(err));
         }
        }
    })
})

module.exports = favouriteRouter;