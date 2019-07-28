/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const { validationResult } = require('express-validator');

const Product = require('../models/product');

exports.getAddProduct = (request, response) => {
  response.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProduct = (request, response, next) => {
  const { title, imageUrl, price, description } = request.body;
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title,
        imageUrl,
        price,
        description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// eslint-disable-next-line consistent-return
exports.getEditProduct = (request, response, next) => {
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
        product,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (request, response, next) => {
  const requestBody = request.body;
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: true,
      hasError: true,
      product: {
        title: requestBody.title,
        imageUrl: requestBody.imageUrl,
        price: requestBody.price,
        description: requestBody.description,
        _id: requestBody.productID
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (request, response, next) => {
  Product.find({ userID: request.user._id })
    .then(products => {
      response.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        hasProducts: products.length > 0
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (request, response, next) => {
  Product.deleteOne({ _id: request.body.productID, userID: request.user._id })
    .then(() => {
      response.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
