// backend/models/QuestionLog.js
const mongoose = require('mongoose');

const questionLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    policy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Policy',
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
questionLogSchema.index({ policy: 1, createdAt: -1 });

module.exports = mongoose.model('QuestionLog', questionLogSchema);
