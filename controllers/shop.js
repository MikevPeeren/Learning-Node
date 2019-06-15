const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (request, response, next) => {
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            response.render('shop/index', {
                products: rows,
                pageTitle: 'Shopaholic',
                path: '/',
                hasProducts: rows.length > 0
            });
        }).catch(error => {
            console.log(error);
        });
};

exports.getProducts = (request, response, next) => {
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            response.render('shop/product-list', {
                products: rows,
                pageTitle: 'Shopaholic',
                path: '/products',
                hasProducts: rows.length > 0
            });
        }).catch(error => {
            console.log(error);
        });
}

exports.getProduct = (request, response, next) => {
    const productID = request.params.productID;
    Product.findByID(productID).then(([product]) => {
        response.render('shop/product-detail', {
            product: product[0],
            pageTitle: product.title,
            path: '/products'
        })
    }).catch(error => console.log(error));
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