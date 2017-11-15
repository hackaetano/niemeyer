const environment = process.env.NODE_ENV;

let isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated() || environment == 'local') {
        return next();
    }

    let info = {
        status: 403,
        message: 'Unauthorized. Please authenticate at /auth/google',
    };

    return res.status(403).json(info);
};

module.exports = isAuthenticated;
