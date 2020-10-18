'use strict';
const 
    express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

const Favorites = require('../models/favorites');

const authenticate = require('../authenticate');
const cors = require('./cors');
const router = express.Router();

router.use(bodyParser.json());

router.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user : req.user._id})
        .populate('user')
        .populate('dishes')
        .then((favorites) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        }, (err) => {
            next(err);
        })
        .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user : req.user._id})
        .then((favorite) => {
            if(favorite !== null) {
                for(let dish of req.body){
                    if(favorite.dishes.indexOf(dish._id) === -1){
                        favorite.dishes.push(dish);
                    }
                    else{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'text/plain');
                        return res.send('Dish already added to your favorites');
                    }
                }
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    }) 
                }, (err) => next(err));
            }
            else {
                Favorites.create({user : req.user._id})
                    .then((favorite) => {
                        for (let dish of req.body)
                            if (favorite.dishes.indexOf(dish._id) === -1)
                                favorite.dishes.push(dish);
                        favorite.save()
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                            .populate('user')
                            .populate('dishes')
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            }) 
                        })
                    }, 
                    (err) => next(err)
                ); 
            }
        })
        .catch((err) => next(err));;
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation is not allowed on "/favorites" pateyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjZlYTIzNWI5MjJiNDAwMTcxNThkMzAiLCJpYXQiOjE2MDI3NTQ3NTUsImV4cCI6MTYwMjc1ODM1NX0._qfuBzl2NldEFLLVQkWJ0MvzHQyUl5J8PeZ3PaNcYZ8h`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({user : req.user._id})
        .then((resp) => {
            if (resp === null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.send('No record found against this user');
            }
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});

router.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user : req.user._id})
    .then((favorite) => {
        if(!favorite){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists" : false, "favorites" : favorite});
        }
        else {
            if (favorite.dishes.indexOf(req.params.dishId) < 0){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists" : false, "favorites" : favorite});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists" : true, "favorites" : favorite});
            }
        }
    })
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user : req.user._id})
        .then((favorite) => {
            if(favorite !== null) {
                if(favorite.dishes.indexOf(req.params.dishId) === -1){
                    favorite.dishes.push({_id : req.params.dishId});
                    favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }) 
                    }, (err) => next(err));
                }
                else{
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'text/plain');
                    res.send('Dish already added to your favorites');
                }
            }
            else {
                Favorites.create({user : req.user._id, dishes : [req.params.dishId]})
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    }, 
                    (err) => next(err)
                ); 
            }
        })
        .catch((err) => next(err));;
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user : req.user._id})
        .then((favorite) => {
            if (favorite != null) {
                let itemIndex = favorite.dishes.indexOf(req.params.dishId);
                if( itemIndex > -1) {
                    favorite.dishes.splice(itemIndex, 1);
                    favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }) 
                    }, (err) => next(err));
                }
                else {
                    let err = new Error(`Regret! No dish found with ID ${req.params.dishId}`);
                    err.status = 404;
                    return next(err);
                }
            }
            else {
                let err = new Error(`Oops! You have no favorite dishes. Please add one`);
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});

module.exports = router;