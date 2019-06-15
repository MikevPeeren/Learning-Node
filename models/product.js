const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');

const Cart = require('./cart');

const rootDir = require('../util/path');
const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = callback => {
    fs.readFile(p, (error, fileContent) => {
        if (error) {
            return callback([]);
        }

        callback(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(ID, title, imageUrl, price, description) {
        this.ID = ID;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
        getProductsFromFile(products => {
            if (this.ID) {
                const existingProductIndex = products.findIndex(product => product.ID === this.ID);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (error) => {
                    console.log(error);
                });
            } else {
                this.ID = uniqid();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (error) => {
                    console.log(error);
                });
            }
        });
    }

    static deleteByID(ID) {
        getProductsFromFile(products => {
            const product = products.find(product => product.ID === ID);
            const updatedProducts = products.filter(product => product.ID !== ID);
            fs.writeFile(p, JSON.stringify(updatedProducts), error => {
                if (!error) {
                    Cart.deleteProduct(ID, product.price);
                }
            })
        });
    }

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }

    static findByID(ID, callback) {
        getProductsFromFile(products => {
            const product = products.find(p => p.ID === ID);
            callback(product);
        });
    }
}