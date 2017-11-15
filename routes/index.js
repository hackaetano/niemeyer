const express = require('express');
const users = require('./users');
const properties = require('./properties');
const router = express.Router();

router.get('/', (req, res) => {
    let info = {};
    info['routes'] = {};

    res.status(201);
    res.json(info);
});

router.use('/users', users);
router.use('/properties', properties);

module.exports = router;
