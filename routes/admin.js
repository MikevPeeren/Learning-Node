// Core Modules
const path = require('path');

// Third Party Node Modules
const express = require('express');

// Own Modules
const rootDir = require('../util/path');

const router = express.Router();

const products = [];

router.get('/add-product', (request, response, next) => {
    response.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
    });
});

router.post('/add-product', (request, response, next) => {
    products.push({
        title: request.body.title
    });
    response.redirect('/');
});

exports.exports = router;
exports.products = products;