// const mongodb = require('mongodb');
// // eslint-disable-next-line prefer-destructuring
// const getDatabase = require('../util/database').getDatabase;

// // eslint-disable-next-line prefer-destructuring
// const ObjectID = mongodb.ObjectID;

// class User {
//   constructor(username, password, email, cart, _id) {
//     this.username = username;
//     this.password = password;
//     this.email = email;
//     this.cart = cart;
//     // eslint-disable-next-line no-underscore-dangle
//     this._id = _id;
//   }

//   save() {
//     const database = getDatabase();
//     return database.collection('users').insertOne(this);
//   }

//   addToCart(product) {
//     let cartProductIndex = -1;
//     let updatedCartItems = [];

//     if (this.cart) {
//       if (this.cart.items) {
//         cartProductIndex = this.cart.items.findIndex(cp => {
//           return cp.productID.toString() === product._id.toString();
//         });
//         updatedCartItems = [...this.cart.items];
//       }
//     }

//     let newQuantity = 1;

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({ productID: new ObjectID(product._id), quantity: newQuantity });
//     }

//     const updatedCart = {
//       items: updatedCartItems
//     };
//     const database = getDatabase();
//     return (
//       database
//         .collection('users')
//         // eslint-disable-next-line no-underscore-dangle
//         .updateOne({ _id: new ObjectID(this._id) }, { $set: { cart: updatedCart } })
//     );
//   }

//   getCart() {
//     const database = getDatabase();

//     let productIDs = [];

//     if (this.cart) {
//       if (this.cart.items) {
//         productIDs = this.cart.items.map(item => {
//           return item.productID;
//         });
//       }
//     }
//     return database
//       .collection('products')
//       .find({ _id: { $in: productIDs } })
//       .toArray()
//       .then(products => {
//         return products.map(product => {
//           return {
//             ...product,
//             quantity: this.cart.items.find(item => {
//               // eslint-disable-next-line no-underscore-dangle
//               return item.productID.toString() === product._id.toString();
//             }).quantity
//           };
//         });
//       });
//   }

//   deleteItemFromCart(productID) {
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productID.toString() !== productID.toString();
//     });
//     const database = getDatabase();
//     return (
//       database
//         .collection('users')
//         // eslint-disable-next-line no-underscore-dangle
//         .updateOne({ _id: new ObjectID(this._id) }, { $set: { cart: { items: updatedCartItems } } })
//     );
//   }

//   addOrder() {
//     const database = getDatabase();
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectID(this._id),
//             name: this.username
//           }
//         };
//         return database.collection('orders').insertOne(order);
//       })
//       .then(result => {
//         this.cart = { items: [] };
//         return database
//           .collection('users')
//           .updateOne({ _id: new ObjectID(this._id) }, { $set: { cart: { items: [] } } });
//       });
//   }

//   getOrders() {
//     const database = getDatabase();
//     return database
//       .collection('orders')
//       .find({ 'user._id': new ObjectID(this._id) })
//       .toArray();
//   }

//   static findUserById(userID) {
//     const database = getDatabase();
//     return database
//       .collection('users')
//       .find({ _id: mongodb.ObjectID(userID) })
//       .next()
//       .then(user => {
//         return user;
//       })
//       .catch(() => {});
//   }
// }

// module.exports = User;
