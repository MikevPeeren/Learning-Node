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
  const product = new Product(title, imageUrl, price, description);

  product
    .save()
    .then(() => {
      response.redirect('/');
    })
    .catch({});
};

// exports.getEditProduct = (request, response) => {
//   const editMode = request.query.edit;
//   if (!editMode) {
//     return response.redirect('/');
//   }
//   const productID = request.params.productID;
//   request.user
//     .getProducts({ where: { id: productID } })
//     .then(products => {
//       const product = products[0];
//       if (!product) {
//         return response.redirect('/');
//       }
//       return response.render('admin/edit-product', {
//         pageTitle: 'Edit Product',
//         path: '/admin/edit-product',
//         editing: editMode,
//         product
//       });
//     })
//     .catch({});
// };

// exports.postEditProduct = (request, response) => {
//   const requestBody = request.body;
//   Product.findByPk(requestBody.productID)
//     .then(product => {
//       product.title = requestBody.title;
//       product.imageUrl = requestBody.imageUrl;
//       product.price = requestBody.price;
//       product.description = requestBody.description;

//       return product.save();
//     })
//     .then(() => {
//       response.redirect('/admin/products');
//     })
//     .catch({});
// };

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

// exports.postDeleteProduct = (request, response) => {
//   Product.findByPk(request.body.productID)
//     .then(product => {
//       return product.destroy();
//     })
//     .then(response.redirect('/admin/products'))
//     .catch({});
// };
