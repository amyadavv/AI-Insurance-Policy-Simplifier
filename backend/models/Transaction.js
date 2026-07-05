// backend/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Transaction must belong to a user'],
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    amount: {
      type: Number,
      required: [true, 'Transaction must specify an amount'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      required: true,
      default: 'INR',
      trim: true,
      uppercase: true,
    },
    gateway: {
      type: String,
      required: true,
      enum: ['stripe', 'razorpay'],
    },
    gatewayPaymentId: {
      type: String,
      required: [true, 'Transaction must hold a gateway receipt ID reference'],
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['success', 'failed', 'refunded'],
      default: 'success',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
