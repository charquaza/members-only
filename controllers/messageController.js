var Message = require('../models/message');
var { body, validationResult } = require('express-validator');

exports.message_list_get = function (req, res, next) {
    Message.find({})
        .populate('author', 'username') //get only the author's username
        .sort({ timestamp: 'desc'}) //sort new posts first
        .exec(function (err, message_list) {
            if (err) {
                return next(err);
            }
    
            res.render('index', { title: 'Members Only', message_list });
        });
};

exports.message_create_get = function (req, res, next) {
    //redirect to home page if user is not logged in
    if (!req.user) {
        res.redirect('/');
        return;
    }

    res.render('message_form', { title: 'New Message' });
};

exports.message_create_post = [
    body('title').trim().notEmpty().withMessage('Title must not be empty')
        .isLength({ max: 100 }).withMessage('Title must not be more than 100 characters')
        .escape(),
    body('content').trim().notEmpty().withMessage('Content must not be empty').escape(),

    function (req, res, next) {
        var errors = validationResult(req);

        var newMessage = new Message(
            {
                title: req.body.title,
                content: req.body.content,
                author: req.user._id,
                timestamp: Date.now() 
            }
        );

        if (!errors.isEmpty()) {
            res.render('message_form', { title: 'New Message', message: newMessage, errors: errors.array() } );
        } else {
            newMessage.save(function (err) {
                if (err) {
                    return next(err);
                }

                res.redirect('/');
            });
        }
    }
];

exports.message_delete_get = function (req, res, next) {
    //redirect to home page if user is not an admin
    if (!req.user || !req.user.is_admin) {
        res.redirect('/');
        return;
    }
    
    Message.findById(req.params.id)
        .populate('author', 'username')
        .exec(function (err, message) {
            if (err) {
                return next(err);
            }

            res.render('message_delete', { title: 'Delete Message', message });
        });
};

exports.message_delete_post = function (req, res, next) {
    Message.findByIdAndDelete(req.body.id, function (err) {
        if (err) {
            return next(err);
        }

        res.redirect('/');
    });
};

