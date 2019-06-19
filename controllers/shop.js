const Product = require('../models/product');

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
  request.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          response.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products
          });
        })
        .catch(() => {});
    })
    .catch(() => {});
};

exports.postCart = (request, response) => {
  const [productID] = request.body.productID;
  let fetchedCart;
  let newQuantity = 1;
  request.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productID } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        [product] = products;
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(productID);
    })
    .then(product => {
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
    })
    .then(() => {
      response.redirect('/cart');
    })
    .catch(() => {});
};

exports.postDeleteCartItem = (request, response) => {
  const [productID] = request.body.productID;
  request.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: productID } });
    })
    .then(products => {
      const [product] = products;
      return product.cartItem.destroy();
    })
    .then(() => {
      response.redirect('/cart');
    })
    .catch(() => {});
};

exports.getOrders = (request, response) => {
  request.user
    .getOrders({ include: ['products'] })
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
  let fetchedCart;
  request.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return request.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              const prod = product;
              prod.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(() => {});
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      response.redirect('/orders');
    })
    .catch(() => {});
};
