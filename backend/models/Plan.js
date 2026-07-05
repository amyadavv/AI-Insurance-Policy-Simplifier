// backend/models/Plan.js
const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a plan name'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      required: [true, 'Please add a display name'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price cannot be negative'],
    },
    billingCycle: {
      type: String,
      required: [true, 'Please add a billing cycle'],
      enum: ['monthly', 'yearly', 'one-time'],
      default: 'monthly',
    },
    uploadLimit: {
      type: Number,
      required: [true, 'Please add a monthly upload limit'],
      default: 1, // e.g. 1 policy per month for free tier
    },
    hasChatbot: {
      type: Boolean,
      default: false,
    },
    hasWhiteLabel: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Plan', planSchema);
