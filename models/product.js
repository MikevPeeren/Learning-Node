const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');

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
    constructor(title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
        this.id = uniqid();
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (error) => {
                console.log(error);
            });
        });
    }

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }

    static findByID(ID, callback) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === ID);
            callback(product);
        });
    }
}