const express = require('express');
const router = express.Router();

const mongoose = require('../db/mongoose');
const Model = require('../models/PropertiesModel')(mongoose);
const Properties = require('../controllers/PropertiesController')(Model);

// Handle Properties
router.get('/', Properties.getAll.bind(Properties));
router.get('/:_id', Properties.getById.bind(Properties));
router.post('/', Properties.create.bind(Properties));
router.put('/:_id', Properties.update.bind(Properties));
router.delete('/:_id', Properties.delete.bind(Properties));

module.exports = router;
