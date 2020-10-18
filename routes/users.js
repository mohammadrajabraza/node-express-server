const express = require('express');
const bodyParser = require('body-parser');
const Users = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

const userRouter = express.Router();

userRouter.use(bodyParser.json());

/* GET users listing. */
router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });

userRouter.route('/')
  .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Users.find({})
      .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

userRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {
  Users.register(new Users({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      }
      else {
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }

        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.json({ success: true, status: 'Registration successful!' });
          });
        });
      }
    });
});

userRouter.post('/login', cors.corsWithOptions, (req, res, next) => {
  
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: false, status: 'Login Unsuccessful!', err: info });
    }
    
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!' });
      }

      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, status: 'Login Successful!', token: token });
    });
  }) (req, res, next);
});

userRouter.get('/logout', cors.corsWithOptions, (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    err = new Error('you are not logged in!');
    err.status = 403;
    next(err);
  }
});

router.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err)
      return next(err);
    
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});

    }
  }) (req, res);
});

userRouter.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'You are successfully logged in!' });
  }
});

module.exports = userRouter;
