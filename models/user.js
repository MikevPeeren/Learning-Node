const mongoose = require('mongoose');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productID: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  }
});

// eslint-disable-next-line func-names
userSchema.methods.addToCart = function(product) {
  let cartProductIndex = -1;
  let updatedCartItems = [];
  let newQuantity = 1;

  if (this.cart) {
    if (this.cart.items) {
      cartProductIndex = this.cart.items.findIndex(cp => {
        // eslint-disable-next-line no-underscore-dangle
        return cp.productID.toString() === product._id.toString();
      });
      updatedCartItems = [...this.cart.items];
    }
  }

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    // eslint-disable-next-line no-underscore-dangle
    updatedCartItems.push({ productID: product._id, quantity: newQuantity });
  }

  const updatedCart = {
    items: updatedCartItems
  };

  this.cart = updatedCart;
  return this.save();
};

// eslint-disable-next-line func-names
userSchema.methods.removeFromCart = function(productID) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productID.toString() !== productID.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

// eslint-disable-next-line func-names
userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);