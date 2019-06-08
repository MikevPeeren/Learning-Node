// Third Party Node Modules
const express = require('express');

// Own Modules
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