const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
  static addProduct(ID, productPrice) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = {
        products: [],
        totalPrice: 0
      };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(product => product.ID === ID);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product & increase quantity
      if (existingProduct) {
        updatedProduct = {
          ...existingProduct
        };
        updatedProduct.quantity += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = {
          ID,
          quantity: 1
        };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += +productPrice;
      fs.writeFile(p, JSON.stringify(cart), () => {});
    });
  }

  static deleteProduct(ID, productPrice) {
    fs.readFile(p, (error, fileContent) => {
      if (error) {
        return;
      }
      const updatedCart = {
        ...JSON.parse(fileContent)
      };
      const product = updatedCart.products.find(prod => prod.ID === ID);
      if (!product) {
        return;
      }
      const productQuantity = product.quantity;

      updatedCart.products = updatedCart.products.filter(prod => prod.ID !== ID);
      updatedCart.totalPrice -= productPrice * productQuantity;

      fs.writeFile(p, JSON.stringify(updatedCart), () => {});
    });
  }

  static getCart(callback) {
    fs.readFile(p, (error, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (error) {
        callback(null);
      } else {
        callback(cart);
      }
    });
  }
};
