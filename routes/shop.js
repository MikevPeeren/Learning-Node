// Core Modules
const path = require('path');

// Third Party Node Modules
const express = require('express');

// Own Modules
const rootDir = require('../util/path')

const router = express.Router();

router.get('/', (request, response, next) => {
    response.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;