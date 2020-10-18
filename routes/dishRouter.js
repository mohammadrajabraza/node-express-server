'use strict';
const 
    express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');

const cors = require('./cors');
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Dishes.find(req.query)
        .populate('comments.author')
        .then((dishes) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dishes);
        }, (err) => {
            next(err);
        })
        .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.create(req.body)
        .then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        }, (err) => {
            next(err);
        })
        .catch((err) => {
            next(err);
        });
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation is not allowed on "/dishes" pateyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjZlYTIzNWI5MjJiNDAwMTcxNThkMzAiLCJpYXQiOjE2MDI3NTQ3NTUsImV4cCI6MTYwMjc1ODM1NX0._qfuBzl2NldEFLLVQkWJ0MvzHQyUl5J8PeZ3PaNcYZ8h`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => {
            next(err);
        })
        .catch((err) => {
            next(err);
        });
});

dishRouter.route('/:dishId')
.get(cors.cors, (req, res, next) => {
   Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation is not allowed on /dishes/${req.url} path`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, 
        { $set: req.body}, 
        { new : true})
        .then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});

/** Router for /:dishId/comments */
dishRouter.route('/:dishId/comments')
.get(cors.cors, (req, res, next) => {
   Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if (dish != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else{
            err = new Error(`Dish with ${req.params.dishId} not found!`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
        .then((dish) => {
            if(dish != null) {
                req.body.author = req.user._id;
                dish.comments.push(req.body);
                dish.save()
                    .then((dish) => {
                        Dishes.findById(dish._id)
                        .populate('comments.author')
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }) 
                    }, (err) => next(err));
            }
            else {
                err = new Error(`Dish with ${req.params.dishId} not found!`);
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation is not allowed on "/dishes/${req.params.dishId}/comments" path`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findById(req.params.dishId)
        .then((dish) => {
            if (dish != null && dish.comments.length != 0) {
                for (let i = (dish.comments.length - 1); i >= 0; i--){
                    dish.comments.id(dish.comments[i]._id).remove();
                }
                dish.save()
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish)
                    }, (err) => next(err));
            }
            else if (dish == undefined) {
                err = new Error(`Dish with ${req.param.dishId} not found!`);
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error(`No comment found to delete in Dish with ID ${req.params.dishId}`);
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});

/** Router for /:dishId/comments/:commentId */
dishRouter.route('/:dishId/comments/:commentId')
.get(cors.cors, (req, res, next) => {
   Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if( dish == null) {
            err = new Error(`Dish with ${req.params.dishId} not found!`);
            err.status = 404;
            return next(err);
        }
        else{
            err = new Error(`Comment with ${req.params.commentId} not found!`);
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation is not allowed on /dishes/${req.url} path`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null) {
            if(req.user._id.equals(dish.comments.id(req.params.commentId).author)){
                if(req.body.rating){
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if(req.body.comment) {
                    dish.comments.id(req.params.commentId).comment = req.body.comment;
                }
                dish.save()
                    .then((dish) => {
                        Dishes.findById(dish._id)
                        .populate('comments.author')
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);  
                        })        
                    }, (err) => next(err));
            }
            else{
                let err = new Error('You are not authorized to modify this comment');
                err.status = 403;
                return next(err);
            }
        }
        else if( dish == null) {
            err = new Error(`Dish with ${req.params.dishId} not found!`);
            err.status = 404;
            return next(err);
        }
        else{
            err = new Error(`Comment with ${req.params.commentId} not found!`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
        .then((dish) => {
            if (dish != null && dish.comments.id(req.params.commentId) != null) {
                if(req.user._id.equals(dish.comments.id(req.params.commentId).author)){
                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                        .then((dish) => {
                            Dishes.findById(dish._id)
                            .populate('comments.author')
                            .then((dish) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(dish);  
                            })   
                        }, (err) => next(err));
                }
                else{
                    let err = new Error('You are not authorized to modify this comment');
                    err.status = 403;
                    return next(err);
                }
            
            }
            else if( dish == null) {
                err = new Error(`Dish with ${req.params.dishId} not found!`);
                err.status = 404;
                return next(err);
            }
            else{
                err = new Error(`Comment with ${req.params.commentId} not found!`);
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});

module.exports = dishRouter;