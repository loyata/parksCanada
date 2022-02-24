const express = require('express');
const passport = require('passport');
const router = express.Router();

const users = require("../controllers/user");

router.route('/register')
    .get(users.renderRegister)
    .post(users.userRegister);

router.route('/login')
    .get(users.renderLogin)
    // isLoggedIn : is current session logged in, if not , redirect to /login, can be used to any post, implemented by req.authenticated()
    // passport.authenticate(): check if inputted username and password matches, if yes, go on, if not, flash a message and redirect to /login again.
    .post(passport.authenticate('local', {failureMessage:true, failureRedirect:'/login'}), users.userLogin);

router.route('/logout')
    .get(users.userLogout);

module.exports = router;