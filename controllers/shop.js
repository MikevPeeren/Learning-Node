const Product = require('../models/product');

exports.getIndex = (request, response) => {
  Product.find()
    .then(products => {
      response.render('shop/index', {
        products,
        pageTitle: 'Shopaholic',
        path: '/',
        hasProducts: products.length > 0
      });
    })
    .catch({});
};

exports.getProducts = (request, response) => {
  Product.find()
    .then(products => {
      response.render('shop/product-list', {
        products,
        pageTitle: 'Shopaholic',
        path: '/products',
        hasProducts: products.length > 0
      });
    })
    .catch({});
};

exports.getProduct = (request, response) => {
  Product.findById(request.params.productID)
    .then(product => {
      response.render('shop/product-detail', {
        product,
        pageTitle: 'test',
        path: '/products'
      });
    })
    .catch({});
};

exports.getCart = (request, response) => {
  request.user
    .populate('cart.items.productID')
    .execPopulate()
    .then(user => {
      response.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.items
      });
    })
    .catch(() => {});
};

exports.postCart = (request, response) => {
  // eslint-disable-next-line prefer-destructuring
  const productID = request.body.productID;
  Product.findById(productID)
    .then(product => {
      return request.user.addToCart(product);
    })
    .then(() => {
      response.redirect('/cart');
    });
};

exports.postDeleteCartItem = (request, response) => {
  // eslint-disable-next-line prefer-destructuring
  const productID = request.body.productID;
  request.user
    .removeFromCart(productID)
    .then(() => {
      response.redirect('/cart');
    })
    .catch(() => {});
};

exports.getOrders = (request, response) => {
  request.user
    .getOrders()
    .then(orders => {
      response.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders
      });
    })
    .catch();
};

exports.postOrder = (request, response) => {
  request.user
    .addOrder()
    .then(result => {
      response.redirect('/orders');
    })
    .catch(() => {});
};
