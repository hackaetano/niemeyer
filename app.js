const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authGoogle = require('./middlewares/authGoogle');
const sessions = require('client-sessions');
const serveFavicon = require('./middlewares/serveFavicon');

const routes = require('./routes');
const app = express();

// Server Config Middlewares:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: true }));
app.use(serveFavicon);

// Session Middleware
app.use(sessions({
    cookieName: 'session',
    secret: process.env.SESSION_KEY,
    duration: 60 * 60 * 1000,
    cookie: {
        httpOnly: false
    }
}));

// Passport Config:
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    done(null, { id:id, email:'test' });
});

passport.use(authGoogle());

// Router:
app.use('/', routes);

// Error Handling:
app.use((req, res, next) => {
    let err = new Error('Resource Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status,
        error: err.message
    });
});


// Server Listener at bin/www:
module.exports = app;
