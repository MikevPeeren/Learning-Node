// Core Modules
const path = require('path');

// Third Party Node Modules
const express = require('express');

// Own Modules
const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (request, response, next) => {
    const products = adminData.products;
    response.render('shop', {
        products: products,
        pageTitle: 'Shopaholic',
        path: '/',
        hasProducts: products.length > 0
    });
});

module.exports = router;