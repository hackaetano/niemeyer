const express = require('express');
const auth = require('./auth');
const users = require('./users');
const properties = require('./properties');
const router = express.Router();

router.get('/', (req, res) => {
    let info = {};
    info['endpoints'] = {
    	'users': '/users',
    	'properties': '/properties'
    };

    res.status(201);
    res.json(info);
});

router.use('/auth', auth);
router.use('/users', users);
router.use('/properties', properties);

module.exports = router;
