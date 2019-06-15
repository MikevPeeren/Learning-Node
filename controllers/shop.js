const Product = require('../models/product');
const Cart = require('../models/cart');

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

exports.getProduct = (request, response, next) => {
    const productID = request.params.productID;
    Product.findByID(productID, product => {
        response.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        })
    });
}

exports.getCart = (request, response, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(productData => productData.ID === product.ID);
                if (cartProductData) {
                    cartProducts.push({
                        productData: product,
                        quantity: cartProductData.quantity
                    });
                }
            }

            response.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });
    });
}

exports.postCart = (request, response, next) => {
    const productID = request.body.productID;
    Product.findByID(productID, product => {
        Cart.addProduct(productID, product.price);
    })
    response.redirect('/cart');
}

exports.postDeleteCartItem = (request, response, next) => {
    const productID = request.body.productID;
    Product.findByID(productID, product => {
        Cart.deleteProduct(productID, product.price);
        response.redirect('/cart')
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