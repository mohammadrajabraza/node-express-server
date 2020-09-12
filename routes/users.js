const express = require('express');
const bodyParser = require('body-parser');
const Users = require('../models/user');
const userRouter = express.Router();

userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

userRouter.post('/signup', (req, res, next) => {
  Users.findOne({username: req.body.username})
    .then((user) => {
      if(user !== null) {
        err = new Error(`Username ${req.body.username} already exist!`);
        err.status = 403;
        next(err);
      }
      else{
        return Users.create({
          username: req.body.username,
          password: req.body.password});
      }
    })
    .then((user) => {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.json({status: 'Registration successful!', user: user});
    }, (err) => next(err))
    .catch((err) => next(err));
});

userRouter.post('/login', (req, res, next) => {
  if(!req.session.user){
    const authHeader = req.headers.authorization;
    if(!authHeader){
      err = new Error('You are not authenticated!');
      err.status = 401;
      res.setHeader('WWW-Authenticate', 'Basic');
      return next(err);
    }
    const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const username = auth[0];
    const password = auth[1];

    Users.findOne({username: username})
    .then((user) => {
      if(user == null){
        err = new Error(`User ${username} does not exist!`);
        err.status = 403;
        return next(err);
      }
      else if (user.password !== password){
        err = new Error('Password is incorrect!');
        err.status = 403;
        return next(err);
      }
      else if(user.username === username && user.password === password){
        req.session.user = 'authenticated';
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 200;
        res.end('You are authenticated!');
      }
    })
    .catch((err) => next(err));
  }
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
