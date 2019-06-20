const getDatabase = require('../util/database');

class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    const database = getDatabase();
    database.collection('products');
  }
}

module.exports = Product;
