const getDatabase = require('../util/database').getDatabase;

class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    const database = getDatabase();
    return database
      .collection('products')
      .insertOne(this)
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  static fetchAll() {
    const database = getDatabase();
    return database
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products);

        return products;
      })
      .catch();
  }
}

module.exports = Product;
