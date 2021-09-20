var User = require('../models/user');
var passport = require('passport');
var bcrypt = require('bcryptjs');
var { body, validationResult } = require('express-validator');

exports.sign_up_get = function (req, res, next) {
    //redirect to home page if user is logged in
    if (req.user) {
        res.redirect('/');
        return;
    }

    res.render('sign_up_form', { title: 'Sign Up' });
};

exports.sign_up_post = [
    //validate and sanitize input
    body('first_name').trim().notEmpty().withMessage('First name must not be empty')
        .isLength({ max: 100 }).withMessage('First name must not be more than 100 characters')
        .escape(),
    body('last_name').trim().notEmpty().withMessage('Last name must not be empty')
        .isLength({ max: 100 }).withMessage('Last name must not be more than 100 characters')
        .escape(),
    body('username').notEmpty().withMessage('Username must not be empty')
        .isLength({ max: 100 }).withMessage('Username must not be more than 100 characters')
        .not().matches(/[<>&'"/]/).withMessage('Username must not contain the following characters: <, >, &, \', ", /'),
    body('password').notEmpty().withMessage('Password must not be empty')
        .isLength({ max: 100 }).withMessage('Password must not be more than 100 characters')
        .not().matches(/[<>&'"/]/).withMessage('Password must not contain the following characters: <, >, &, \', ", /'),
    body('confirm_password').custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match')
        .escape(),
    
    function (req, res, next) {
        var errors = validationResult(req);

        var newUser = new User(
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                password: req.body.password
            }
        );
        
        if (!errors.isEmpty()) {
            res.render('sign_up_form', { title: 'Sign Up', user: newUser, errors: errors.array() });
        } else {
            //save user with encrypted password
            bcrypt.hash(newUser.password, 10, function (err, passwordHash) {
                if (err) {
                    return next(err);
                }

                newUser.password = passwordHash;

                newUser.save(function (err, user) {
                    if (err) {
                        return next(err);
                    }

                    //log in the new user
                    req.login(user, function (err) {
                        if (err) {
                          return next(err);
                        }
                  
                        res.redirect('/')
                      });
                });
            });
        }
    }
];

exports.log_in_get = function (req, res, next) {
    //redirect to home page if user is logged in
    if (req.user) {
        res.redirect('/');
        return;
    }

    res.render('log_in_form', { title: 'Log In' });
};

exports.log_in_post = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err);
      }
  
      if (!user) {
        res.render('log_in_form', { title: 'Log In', error: info.message });
      } else {
        req.login(user, function (err) {
          if (err) {
            return next(err);
          }
    
          res.redirect('/')
        });
      }
    })(req, res, next);
};

exports.log_out_get = function (req, res, next) {
    req.logout();
    res.redirect('/');
};

exports.join_club_get = function (req, res, next) {
    res.render('member_form', { title: 'Join the Club' });
};

exports.join_club_post = [
    body('passcode').custom(function (value) {
            return value === process.env.MEMBER_PASSCODE;
        })
        .withMessage('Incorrect passcode').escape(),

    function (req, res, next) {
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('member_form', { title: 'Join the Club', errors: errors.array() });
        } else {
            User.findByIdAndUpdate(req.user, { is_member: true }, function (err) {
                if (err) {
                    return next(err);
                }

                res.redirect('/');
            })
        }
    }
];

exports.admin_get = function (req, res, next) {
    res.render('admin_form', {title: 'Admin' });
};

exports.admin_post = [
    body('passcode').custom(function (value) {
        return value === process.env.ADMIN_PASSCODE;
    })
    .withMessage('Incorrect passcode').escape(),

    function (req, res, next) {
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('admin_form', { title: 'Admin', errors: errors.array() });
        } else {
            User.findByIdAndUpdate(req.user, { is_admin: true }, function (err) {
                if (err) {
                    return next(err);
                }

                res.redirect('/');
            })
        }
    }
];