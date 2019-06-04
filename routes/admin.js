// Core Modules
const path = require('path');

// Third Party Node Modules
const express = require('express');

// Own Modules
const rootDir = require('../util/path');

const router = express.Router();

const products = [];

router.get('/add-product', (request, response, next) => {
    response.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/add-product', (request, response, next) => {
    products.push({
        title: request.body.title
    });
    response.redirect('/');
});

exports.exports = router;
exports.products = products;