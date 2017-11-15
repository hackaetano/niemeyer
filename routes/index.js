const express = require('express');
const router = express.Router();
const auth = require('./auth');

const mongoose = require('../db/mongoose');
const UserModel = require('../models/UsersModel')(mongoose);
const PropertyModel = require('../models/PropertiesModel')(mongoose);

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


// Handle Users
const Users = require('../controllers/UsersController')(UserModel);
router.get('/users', Users.getAll.bind(Users));
router.post('/users', Users.create.bind(Users));
router.get('/users/:_id', Users.getById.bind(Users));
router.put('/users/:_id', Users.update.bind(Users));
router.delete('/users/:_id', Users.delete.bind(Users));


// Handle Properties
const Properties = require('../controllers/PropertiesController')(PropertyModel);
router.get('/properties', Properties.getAll.bind(Properties));
router.post('/properties', Properties.create.bind(Properties));
router.get('/properties/:_id', Properties.getById.bind(Properties));
router.put('/properties/:_id', Properties.update.bind(Properties));
router.delete('/properties/:_id', Properties.delete.bind(Properties));


// Handle Matches
const Matches = require('../controllers/MatchesController')(UserModel, PropertyModel);
router.get('/users/:_id/matches', Matches.getMatches.bind(Matches));



module.exports = router;
