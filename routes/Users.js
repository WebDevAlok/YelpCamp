const express = require('express');
const passport = require('passport');
const { checkReturnTo } = require('../middleware');
const router = express.Router();
const user = require('../controllers/users')
const catchAsync = require('../utils/catchAsync');

router.route('/register')
    .get(user.renderRegisterForm)
    .post(catchAsync(user.registerUser));

router.route('/login')
    .get(user.renderLoginForm)
    .post( checkReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), user.login);

router.get('/logout', user.logout);

module.exports = router;