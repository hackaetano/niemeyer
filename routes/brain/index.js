const express = require('express');
const router = express.Router();

const security = function() {};
const quality = function() {};

router.get('/', (req, res) => {
    let info = {};
    info['endpoints'] = {
    	'quality': '/brain/quality',
    	'security': '/brain/security',
    	'price': '/brain/price'
    };

    res.status(201);
    res.json(info);
});

router.use('/quality', quality);
router.use('/security', security);

module.exports = router;
