const mongoose = require('mongoose');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: {
        type: Object,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  user: {
    name: {
      type: String,
      required: true
    },
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);
