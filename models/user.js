const mongodb = require('mongodb');
const getDatabase = require('../util/database').getDatabase;

class User {
  constructor(username, password, email) {
    this.username = username;
    this.password = password;
    this.email = email;
  }

  save() {
    const database = getDatabase();
    return database.collection('users').insertOne(this);
  }

  static findUserById(userID) {
    const database = getDatabase();
    return database
      .collection('users')
      .find({ _id: mongodb.ObjectID(userID) })
      .next()
      .then(user => {
        return user;
      })
      .catch(() => {});
  }
}
module.exports = User;
