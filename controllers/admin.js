const Product = require('../models/product');

exports.getAddProduct = (request, response, next) => {
    response.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
}

exports.postAddProduct = (request, response, next) => {
    const body = request.body;
    const product = new Product(body.title, body.imageUrl, body.price, body.description);
    product.save();

    response.redirect('/');
}

exports.getProducts = (request, response, next) => {
    Product.fetchAll(products => {
        response.render('admin/products', {
            products: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            hasProducts: products.length > 0
        });
    });
}