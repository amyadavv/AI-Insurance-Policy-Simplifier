// backend/models/Appeal.js
const mongoose = require('mongoose');

const appealSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    policyFileName: {
      type: String,
      required: true,
    },
    denialFileName: {
      type: String,
      required: true,
    },
    policyFileUrl: {
      type: String,
      default: '',
    },
    denialFileUrl: {
      type: String,
      default: '',
    },
    denialReason: {
      type: String,
      default: '',
    },
    policyAnalysis: {
      type: String,
      default: '',
    },
    keyArguments: [
      {
        type: String,
      },
    ],
    appealLetter: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing',
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
appealSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Appeal', appealSchema);
