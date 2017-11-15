const express = require('express');
const passport = require('passport');
const router = express.Router();

let authScope = {
    scope: ['https://www.googleapis.com/auth/plus.profile.emails.read']
}

router.get('/google', passport.authenticate('google', authScope));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/unauthorized'
}));

router.get('/unauthorized', function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect(301, '/');
    }

    req.session.reset();
    req.logout();
    res.status(403).json({
        error: 403,
        message: "The login has fail or you're unauthorized to login with this credentials."
    })
});

router.get('/logout', function(req, res) {
    req.session.reset();
    req.logout();
    res.json({
        message: "You're logged out"
    })
});

module.exports = router;
