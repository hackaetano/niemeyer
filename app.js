const express = require('express');
const bodyParser = require('body-parser');
const serveFavicon = require('./middlewares/serveFavicon');

const routes = require('./routes');
const app = express();

// Server Config Middlewares:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: true }));
app.use(serveFavicon);

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
