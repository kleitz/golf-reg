
var express = require('express');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var router = express.Router();
var persist = require('../persist');
var csp = require('js-csp');

passport.use(new localStrategy({
        usernameField: 'email'
    },
    function(username, password, done) {
        player = csp.take(persist.getPlayerByEmail(username));
            if (!player) {
                return done(null, false, { message: 'Incorrect email/password.' });
            }
            player.comparePassword(password, function() {
                if (err)
                    return done(null, false, {message: 'Incorrect email/password.'});
                else
                    return done(null, player);
            });
    }));




const loginForm = function(req, res, next) {
     res.render('login.jade');
    },
    loginSubmission = function(req, res, next) {

    },
    resetForm = function(req, res, next) {
        res.render('reset.jade');
    },
    resetSubmission = function(req, res, next) {

    };

// login screen - index
router.get('/login', loginForm);

// login
router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });
// password reset form
router.get('/reset/:token', resetForm);

router.post('/reset/:token', resetSubmission);

module.exports = router;