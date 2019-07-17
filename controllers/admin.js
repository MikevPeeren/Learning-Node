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
  const product = new Product({
    title,
    imageUrl,
    price,
    description,
    userID: request.user
  });
  product
    .save()
    .then(() => {
      response.redirect('/admin/products');
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
  Product.findById(productID)
    .then(product => {
      if (!product) {
        return response.redirect('/');
      }
      response.render('admin/edit-product', {
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
  Product.findById(requestBody.productID)
    .then(product => {
      // eslint-disable-next-line no-underscore-dangle
      if (product.userID.toString() !== request.user._id.toString()) {
        return response.redirect('/');
      }
      product.title = requestBody.title;
      product.imageUrl = requestBody.imageUrl;
      product.price = requestBody.price;
      product.description = requestBody.description;
      return product.save().then(() => {
        response.redirect('/admin/products');
      });
    })
    .catch(() => {});
};

exports.getProducts = (request, response) => {
  Product.find({ userID: request.user._id })
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
  Product.deleteOne({ _id: request.body.productID, userID: request.user._id })
    .then(() => {
      response.redirect('/admin/products');
    })
    .catch({});
};
