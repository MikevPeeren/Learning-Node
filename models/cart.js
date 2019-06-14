const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(ID, productPrice) {
    
      // Fetch the previous cart
      fs.readFile(p, (err, fileContent) => {
        let cart = { products: [], totalPrice: 0 };
        if (!err) {
          cart = JSON.parse(fileContent);
        }
        // Analyze the cart => Find existing product
        const existingProductIndex = cart.products.findIndex(
          product => product.ID === ID
        );
        const existingProduct = cart.products[existingProductIndex];
        let updatedProduct;
        // Add new product & increase quantity
        if (existingProduct) {
          updatedProduct = { ...existingProduct };
          updatedProduct.quantity = updatedProduct.quantity + 1;
          cart.products = [...cart.products];
          cart.products[existingProductIndex] = updatedProduct;
        } else {
          updatedProduct = { ID: ID, quantity: 1 };
          cart.products = [...cart.products, updatedProduct];
        }
        cart.totalPrice = cart.totalPrice + +productPrice;
        fs.writeFile(p, JSON.stringify(cart), err => {
          console.log(err);
        });
      });
    }
  };
  