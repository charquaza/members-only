var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');
var message_controller = require('../controllers/messageController');

// for easy access to user in views
router.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

/* GET home page. */
router.get('/', message_controller.message_list_get);

router.get('/sign-up', user_controller.sign_up_get);
router.post('/sign-up', user_controller.sign_up_post);

router.get('/log-in', user_controller.log_in_get);
router.post('/log-in', user_controller.log_in_post);

router.get('/log-out', user_controller.log_out_get);

router.get('/join-club', user_controller.join_club_get);
router.post('/join-club', user_controller.join_club_post);

router.get('/admin', user_controller.admin_get);
router.post('/admin', user_controller.admin_post);

router.get('/message/create', message_controller.message_create_get);
router.post('/message/create', message_controller.message_create_post);

router.get('/message/:id/delete', message_controller.message_delete_get);
router.post('/message/:id/delete', message_controller.message_delete_post);

module.exports = router;