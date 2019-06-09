const Product = require('../models/product');

exports.getProducts = (request, response, next) => {
    const products = Product.fetchAll(products => {
        response.render('shop', {
            products: products,
            pageTitle: 'Shopaholic',
            path: '/',
            hasProducts: products.length > 0
        });
    });
}

exports.getAddProduct = (request, response, next) => {
    response.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
}

exports.postAddProduct = (request, response, next) => {
    const product = new Product(request.body.title);
    product.save();

    response.redirect('/');
}