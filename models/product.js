const db = require('..//util/database');

const uniqid = require('uniqid');

const Cart = require('./cart');

module.exports = class Product {
    constructor(ID, title, imageUrl, price, description) {
        this.ID = ID;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
        return db.execute('INSERT INTO products (title, imageUrl, price, description) VALUES (?,?,?,?)',
            [this.title, this.imageUrl, this.price, this.description]
        )
    }

    static deleteByID(ID) {
        return db.execute('DELETE * from products WHERE product.id = ?',
            [ID]
        );
    }

    static fetchAll() {
        return db.execute('SELECT * from products');
    }

    static findByID(ID) {
        return db.execute('SELECT * from products WHERE products.id = ?',
            [ID]
        );
    }
}