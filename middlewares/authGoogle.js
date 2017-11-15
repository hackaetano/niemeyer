const GoogleStrategy = require('passport-google-oauth20').Strategy;
const environment = process.env.NODE_ENV || 'local';
const config = require('../config/default.json')[environment];

const settings = {
    clientID: process.env.G_CLIENT_ID,
    clientSecret: process.env.G_CLIENT_SECRET,
    callbackURL: config.domain + '/auth/google/callback',
    passReqToCallback: true
};

let strategyMiddleware = function(request, accessToken, refreshToken, profile, done) {
    request.session.accessToken = accessToken;

    process.nextTick(function() {
        if (profile._json.domain != 'escale.com.br') {
            return done(null, false);
        }
        return done(null, profile);
    });
};

module.exports = function() {
    return new GoogleStrategy(settings, strategyMiddleware);
};