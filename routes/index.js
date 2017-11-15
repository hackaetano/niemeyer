const express = require('express');
const router = express.Router();
const auth = require('./auth');
const users = require('./users');
const properties = require('./properties');
const brain = require('./brain');

router.get('/', (req, res) => {
    let info = {};
    info['endpoints'] = {
    	'users': '/users',
    	'properties': '/properties',
    	'brain': '/brain'
    };

    res.status(201);
    res.json(info);
});

router.use('/auth', auth);
router.use('/users', users);
router.use('/properties', properties);

router.use('/brain', brain);

module.exports = router;
