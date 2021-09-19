require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

//set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI || process.env.DEV_DB_URI;
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/// Is this the best place to set up session and passport?

//session setup
var session = require('express-session');
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));

//passport setup
var passport = require('passport');
var LocalStrategy = require('passport-local');

var bcrypt = require('bcryptjs');
var User = require('./models/user');

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      bcrypt.compare(password, user.password, function (err, res) {
        if (err) {
          return done(err);
        }

        if (res) {
          return done(null, user);
        }

        return done(null, false, { message: 'Invalid credentials' });
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      return done(err);
    }

    return done(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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
