const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (request, response) => {
  Product.findAll()
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
  Product.findAll()
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
  Product.findByPk(request.params.productID)
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
  Cart.getCart(cart => {
    Product.findAll()
      .then(products => {
        const cartProducts = [];
        for (product of products) {
          const cartProductData = cart.products.find(
            productData => parseInt(productData.ID) === product.id
          );
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
      })
      .catch({});
  });
};

exports.postCart = (request, response) => {
  Product.findByPk(request.body.productID)
    .then(product => {
      Cart.addProduct(request.body.productID, product.price);
      response.redirect('/cart');
    })
    .catch({});
};

exports.postDeleteCartItem = (request, response) => {
  Product.findByPk(request.body.productID, product => {
    Cart.deleteProduct(request.body.productID, product.price);
    response.redirect('/cart');
  });
};

exports.getOrders = (request, response) => {
  response.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckOut = (request, response) => {
  response.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
