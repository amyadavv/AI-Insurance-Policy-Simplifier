// backend/models/Policy.js
const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Original document info
    originalFileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'image'],
      required: true,
    },
    fileUrl: {
      type: String, // Cloudinary URL
      required: true,
    },
    cloudinaryPublicId: {
      type: String, // For deletion from Cloudinary
      required: true,
    },
    fileSize: {
      type: Number, // in bytes
    },

    // OCR extracted text
    extractedText: {
      type: String,
      default: '',
    },
    ocrConfidence: {
      type: Number, // 0-100 confidence score
      default: null,
    },

    // AI-generated simplified summary
    simplifiedSummary: {
      overview: {
        type: String, // Plain English overview of the policy
        default: '',
      },
      policyType: {
        type: String, // e.g., "Health Insurance", "Auto Insurance"
        default: '',
      },
      coverage: [
        {
          item: String,        // What is covered
          description: String,  // Plain English explanation
          limit: String,        // Coverage limit if mentioned
        },
      ],
      exclusions: [
        {
          item: String,        // What is NOT covered
          description: String,  // Why it matters
          impact: String,       // How it affects claims
        },
      ],
      conditions: [
        {
          condition: String,    // The condition/requirement
          explanation: String,  // What it means in plain English
          importance: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
          },
        },
      ],
      claimProcess: {
        type: String, // How to file a claim (simplified)
        default: '',
      },
      keyNumbers: {
        premium: String,       // Monthly/annual premium
        deductible: String,    // Deductible amount
        maxCoverage: String,   // Maximum coverage limit
        waitingPeriod: String, // Waiting period if applicable
      },
      warnings: [String],      // Important warnings/red flags
      recommendations: [String], // AI recommendations for the user
    },

    // Processing status
    status: {
      type: String,
      enum: ['uploaded', 'extracting', 'simplifying', 'completed', 'failed'],
      default: 'uploaded',
    },
    errorMessage: {
      type: String,
      default: '',
    },

    // Metadata
    tags: [String], // User-added tags like "health", "car", "home"
    isBookmarked: {
      type: Boolean,
      default: false,
    },
    clientName: {
      type: String,
      default: '',
    },
    clientEmail: {
      type: String,
      default: '',
    },
    isWhiteLabeled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
policySchema.index({ user: 1, createdAt: -1 });
policySchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Policy', policySchema);
