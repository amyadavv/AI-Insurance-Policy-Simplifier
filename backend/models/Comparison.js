// backend/models/Comparison.js
const mongoose = require('mongoose');

const comparisonSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    policyAFileName: {
      type: String,
      required: true,
    },
    policyBFileName: {
      type: String,
      required: true,
    },
    policyAFileUrl: {
      type: String,
      default: '',
    },
    policyBFileUrl: {
      type: String,
      default: '',
    },
    comparisonData: {
      policyA: {
        name: String,
        type: String,
      },
      policyB: {
        name: String,
        type: String,
      },
      comparisonGrid: [
        {
          feature: String,
          policyAValue: String,
          policyBValue: String,
          comparison: String,
          winner: {
            type: String,
            enum: ['policyA', 'policyB', 'tie'],
          },
        },
      ],
      winnerRecommendation: String,
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
comparisonSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Comparison', comparisonSchema);
