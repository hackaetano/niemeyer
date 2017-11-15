const express = require('express');
const router = express.Router();

const mongoose = require('../db/mongoose');
const Model = require('../models/UsersModel')(mongoose);
const Users = require('../controllers/UsersController')(Model);

// Handle Users
router.get('/', Users.getAll.bind(Users));
router.get('/:_id', Users.getById.bind(Users));
router.post('/', Users.create.bind(Users));
router.put('/:_id', Users.update.bind(Users));
router.delete('/:_id', Users.delete.bind(Users));

module.exports = router;
