// backend/controllers/comparisonController.js
const Comparison = require('../models/Comparison');
const Policy = require('../models/Policy');
const { uploadToCloudinary } = require('../services/cloudinaryService');
const { extractText } = require('../services/ocrService');
const { comparePolicies } = require('../services/aiService');

// @desc    Create and process side-by-side policy comparison
// @route   POST /api/comparison/upload
// @access  Private
const createComparison = async (req, res) => {
  try {
    let policyAText = '';
    let policyBText = '';
    let policyAFileName = '';
    let policyBFileName = '';
    let policyAFileUrl = '';
    let policyBFileUrl = '';

    const { policyAId, policyBId } = req.body;

    // 1. Process Policy A
    if (policyAId) {
      const policyAObj = await Policy.findOne({ _id: policyAId, user: req.user._id });
      if (!policyAObj) {
        res.status(404);
        throw new Error('Selected Policy A not found');
      }
      policyAText = policyAObj.extractedText;
      policyAFileName = policyAObj.originalFileName;
      policyAFileUrl = policyAObj.fileUrl;
    } else {
      const fileA = req.files && req.files.policyA ? req.files.policyA[0] : null;
      if (!fileA) {
        res.status(400);
        throw new Error('Please upload or select Policy A');
      }
      console.log('📤 Uploading Policy A to Cloudinary...');
      const mime = fileA.mimetype;
      const type = mime === 'application/pdf' ? 'pdf' : 'image';
      const cloudinaryResult = await uploadToCloudinary(
        fileA.buffer,
        'comparisons',
        type === 'pdf' ? 'raw' : 'image'
      );
      policyAFileUrl = cloudinaryResult.url;
      policyAFileName = fileA.originalname;

      console.log('🔍 Extracting text from Policy A...');
      const ocrResult = await extractText(fileA.buffer, mime);
      policyAText = ocrResult.text;
    }

    // 2. Process Policy B
    if (policyBId) {
      const policyBObj = await Policy.findOne({ _id: policyBId, user: req.user._id });
      if (!policyBObj) {
        res.status(404);
        throw new Error('Selected Policy B not found');
      }
      policyBText = policyBObj.extractedText;
      policyBFileName = policyBObj.originalFileName;
      policyBFileUrl = policyBObj.fileUrl;
    } else {
      const fileB = req.files && req.files.policyB ? req.files.policyB[0] : null;
      if (!fileB) {
        res.status(400);
        throw new Error('Please upload or select Policy B');
      }
      console.log('📤 Uploading Policy B to Cloudinary...');
      const mime = fileB.mimetype;
      const type = mime === 'application/pdf' ? 'pdf' : 'image';
      const cloudinaryResult = await uploadToCloudinary(
        fileB.buffer,
        'comparisons',
        type === 'pdf' ? 'raw' : 'image'
      );
      policyBFileUrl = cloudinaryResult.url;
      policyBFileName = fileB.originalname;

      console.log('🔍 Extracting text from Policy B...');
      const ocrResult = await extractText(fileB.buffer, mime);
      policyBText = ocrResult.text;
    }

    // Create draft comparison record
    const comparison = await Comparison.create({
      user: req.user._id,
      policyAFileName,
      policyBFileName,
      policyAFileUrl,
      policyBFileUrl,
      status: 'processing',
    });

    if (!policyAText || policyAText.length < 50) {
      comparison.status = 'failed';
      comparison.errorMessage = 'Could not extract text from Policy A document. Please ensure it is clear.';
      await comparison.save();
      return res.status(422).json({ success: false, message: comparison.errorMessage, data: comparison });
    }

    if (!policyBText || policyBText.length < 50) {
      comparison.status = 'failed';
      comparison.errorMessage = 'Could not extract text from Policy B document. Please ensure it is clear.';
      await comparison.save();
      return res.status(422).json({ success: false, message: comparison.errorMessage, data: comparison });
    }

    // 3. Generate Side-by-Side Comparison
    console.log('🤖 Invoking Gemini AI for side-by-side comparison...');
    try {
      const comparisonResult = await comparePolicies(policyAText, policyBText);
      comparison.comparisonData = comparisonResult;
      comparison.status = 'completed';
      await comparison.save();

      res.status(201).json({
        success: true,
        message: 'Policies compared successfully',
        data: comparison,
      });
    } catch (aiError) {
      comparison.status = 'failed';
      comparison.errorMessage = aiError.message || 'AI comparison generation failed';
      await comparison.save();
      res.status(500).json({ success: false, message: comparison.errorMessage, data: comparison });
    }
  } catch (error) {
    console.error('❌ Claims Comparison Error:', error.message);
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user comparisons
// @route   GET /api/comparison
// @access  Private
const getComparisons = async (req, res) => {
  try {
    const comparisons = await Comparison.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: comparisons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single comparison details
// @route   GET /api/comparison/:id
// @access  Private
const getComparisonById = async (req, res) => {
  try {
    const comparison = await Comparison.findOne({ _id: req.params.id, user: req.user._id });
    if (!comparison) {
      return res.status(404).json({ success: false, message: 'Comparison details not found' });
    }
    res.json({ success: true, data: comparison });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete comparison
// @route   DELETE /api/comparison/:id
// @access  Private
const deleteComparison = async (req, res) => {
  try {
    const comparison = await Comparison.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!comparison) {
      return res.status(404).json({ success: false, message: 'Comparison details not found' });
    }
    res.json({ success: true, message: 'Comparison deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createComparison,
  getComparisons,
  getComparisonById,
  deleteComparison,
};
