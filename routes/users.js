const express = require('express');
const bodyParser = require('body-parser');
const Users = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');

const userRouter = express.Router();

userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter.route('/')
  .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      Users.find({})
        .then((users) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(users);
        }, (err) => next(err))
        .catch((err) => next(err));
  });

userRouter.post('/signup', (req, res, next) => {
  Users.register(new Users({username: req.body.username}),
    req.body.password, (err, user) => {
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err : err});
      }
      else{
        if(req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if(req.body.lastname) {
          user.lastname = req.body.lastname;
        }

        user.save((err, user) => {
          if(err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
            return;
          }
          passport.authenticate('local')(req,res, ()=>{
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.json({ success : true ,status: 'Registration successful!'});
          });
        });
      }
    });
});

userRouter.post('/login',passport.authenticate('local'), (req, res) => {
  const token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'})
});

userRouter.get('/logout', authenticate.verifyUser, (req, res, next) => {
  if(req.user){
    req.logout();
    // req.session.destroy();
    // res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    err = new Error('you are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = userRouter;
