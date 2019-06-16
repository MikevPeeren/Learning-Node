/* eslint-disable no-param-reassign */

const Product = require('../models/product');

exports.getAddProduct = (request, response) => {
  response.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (request, response) => {
  const { title, imageUrl, price, description } = request.body;
  request.user
    .createProduct({
      title,
      imageUrl,
      price,
      description
    })
    .then(() => {
      response.redirect('/');
    })
    .catch({});
};

// eslint-disable-next-line consistent-return
exports.getEditProduct = (request, response) => {
  const editMode = request.query.edit;
  if (!editMode) {
    return response.redirect('/');
  }

  Product.findByPk(request.params.productID)
    .then(product => {
      if (!product) {
        return response.redirect('/');
      }
      return response.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product
      });
    })
    .catch({});
};

exports.postEditProduct = (request, response) => {
  const requestBody = request.body;
  Product.findByPk(requestBody.productID)
    .then(product => {
      product.title = requestBody.title;
      product.imageUrl = requestBody.imageUrl;
      product.price = requestBody.price;
      product.description = requestBody.description;

      return product.save();
    })
    .then(() => {
      response.redirect('/admin/products');
    })
    .catch({});
};

exports.getProducts = (request, response) => {
  Product.findAll()
    .then(products => {
      response.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        hasProducts: products.length > 0
      });
    })
    .catch({});
};

exports.postDeleteProduct = (request, response) => {
  Product.findByPk(request.body.productID)
    .then(product => {
      return product.destroy();
    })
    .then(response.redirect('/admin/products'))
    .catch({});
};
