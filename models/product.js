const mongodb = require('mongodb');
const getDatabase = require('../util/database').getDatabase;

class Product {
  constructor(title, imageUrl, price, description, _id) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
    // eslint-disable-next-line no-underscore-dangle
    this._id = _id ? new mongodb.ObjectID(_id) : null;
  }

  save() {
    const database = getDatabase();
    let databaseOperation;
    // eslint-disable-next-line no-underscore-dangle
    if (this._id) {
      databaseOperation = database.collection('products').updateOne(
        {
          // eslint-disable-next-line no-underscore-dangle
          _id: mongodb.ObjectId(this._id)
        },
        { $set: this }
      );
    } else {
      databaseOperation = database.collection('products').insertOne(this);
    }

    return databaseOperation.then(() => {}).catch(() => {});
  }

  static fetchAll() {
    const database = getDatabase();
    return database
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(() => {});
  }

  static getProductByID(productID) {
    const database = getDatabase();
    return database
      .collection('products')
      .find({ _id: mongodb.ObjectID(productID) })
      .next()
      .then(product => {
        return product;
      })
      .catch(() => {});
  }

  static deleteById(productID) {
    const database = getDatabase();
    return database
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(productID) })
      .then()
      .catch();
  }
}

module.exports = Product;
