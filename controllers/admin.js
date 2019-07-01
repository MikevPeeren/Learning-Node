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
  const product = new Product(title, imageUrl, price, description, null, request.user._id);

  product
    .save()
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
  // eslint-disable-next-line prefer-destructuring
  const productID = request.params.productID;
  Product.getProductByID(productID)
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
    .catch(() => {});
};

exports.postEditProduct = (request, response) => {
  const requestBody = request.body;

  const product = new Product(
    requestBody.title,
    requestBody.imageUrl,
    requestBody.price,
    requestBody.description,
    requestBody.productID
  );

  product
    .save()
    .then(() => {
      response.redirect('/admin/products');
    })
    .catch(() => {});
};

exports.getProducts = (request, response) => {
  Product.fetchAll()
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
  Product.deleteById(request.body.productID)
    .then(() => {
      response.redirect('/admin/products');
    })
    .catch({});
};
