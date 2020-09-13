const express = require('express');
const bodyParser = require('body-parser');
const Users = require('../models/user');
const passport = require('passport');
const userRouter = express.Router();

userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
        passport.authenticate('local')(req,res, ()=>{
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.json({ success : true ,status: 'Registration successful!'});
        });
      }
    });
});

userRouter.post('/login',passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'You are successfully logged in!'})
});

userRouter.get('/logout', (req, res, next) => {
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    err = new Error('you are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = userRouter;
