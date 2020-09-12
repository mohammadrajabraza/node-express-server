const createError = require('http-errors');
const mongoose = require('mongoose')
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishesRouter = require('./routes/dishRouter');
const leadersRouter = require('./routes/leaderRouter');
const promosRouter = require('./routes/promoRouter');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';

const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Connected successfullt to the server');
}, (err) => {console.log(err); });

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321'));
app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

function auth(req, res, next){
  console.log(req.signedCookies);
  if (!req.signedCookies.user){

    const authHeader = req.headers.authorization;
  
    if(!authHeader){
      const err  = new Error("You are not authenticated!");
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
      return;
    }

    const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const userName = auth[0];
    const password = auth[1];

    if(userName == 'admin' && password == 'password'){
      res.cookie('user', 'admin', {signed: true});
      next();
    }
    else{
      err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err)

    }
  }
  else{
    if(req.signedCookies.user == 'admin'){
      next();
    }
    else {
      err = new Error('You are not authenticated!');
      err.status = 401;
      next(err);
    }
  }
}

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishesRouter);
app.use('/promotions', promosRouter);
app.use('/leaders', leadersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
