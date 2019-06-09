const Product = require('../models/product');

exports.getIndex = (request, response, next) => {
    Product.fetchAll(products => {
        response.render('shop/index', {
            products: products,
            pageTitle: 'Shopaholic',
            path: '/',
            hasProducts: products.length > 0
        });
    });
};

exports.getProducts = (request, response, next) => {
    Product.fetchAll(products => {
        response.render('shop/product-list', {
            products: products,
            pageTitle: 'Shopaholic',
            path: '/products',
            hasProducts: products.length > 0
        });
    });
}

exports.getCart = (request, response, next) => {
    response.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart'
    });
}

exports.getOrders = (request, response, next) => {
    response.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
}

exports.getCheckOut = (request, response, next) => {
    response.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
}