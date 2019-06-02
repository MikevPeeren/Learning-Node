// Core Modules
const path = require('path');

// Third Party Node Modules
const express = require('express');

// Own Modules
const rootDir = require('../util/path');

const router = express.Router();

router.get('/add-product', (request, response, next) => {
    response.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/add-product', (request, response, next) => {
    console.log(request.body);
    response.redirect('/');
});

module.exports = router;