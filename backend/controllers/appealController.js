// backend/controllers/appealController.js
const Appeal = require('../models/Appeal');
const Policy = require('../models/Policy');
const { uploadToCloudinary } = require('../services/cloudinaryService');
const { extractText } = require('../services/ocrService');
const { generateAppealLetter } = require('../services/aiService');

// @desc    Create and process claims appeal
// @route   POST /api/appeal/upload
// @access  Private
const createAppeal = async (req, res) => {
  try {
    let policyText = '';
    let policyFileName = '';
    let policyFileUrl = '';

    // 1. Get denial letter file
    const denialFile = req.files && req.files.denial ? req.files.denial[0] : null;
    if (!denialFile) {
      res.status(400);
      throw new Error('Please upload a claim denial letter');
    }

    // 2. Handle Policy (can be either existing policyId OR new policy file upload)
    const { policyId } = req.body;
    if (policyId) {
      const policy = await Policy.findOne({ _id: policyId, user: req.user._id });
      if (!policy) {
        res.status(404);
        throw new Error('Selected policy not found');
      }
      policyText = policy.extractedText;
      policyFileName = policy.originalFileName;
      policyFileUrl = policy.fileUrl;
    } else {
      const policyFile = req.files && req.files.policy ? req.files.policy[0] : null;
      if (!policyFile) {
        res.status(400);
        throw new Error('Please upload your insurance policy or select an existing one');
      }

      console.log('📤 Uploading policy file to Cloudinary...');
      const policyMime = policyFile.mimetype;
      const policyType = policyMime === 'application/pdf' ? 'pdf' : 'image';
      const policyCloudinary = await uploadToCloudinary(
        policyFile.buffer,
        'appeals-policies',
        policyType === 'pdf' ? 'raw' : 'image'
      );
      policyFileUrl = policyCloudinary.url;
      policyFileName = policyFile.originalname;

      console.log('🔍 Extracting text from policy...');
      const policyOcr = await extractText(policyFile.buffer, policyMime);
      policyText = policyOcr.text;
    }

    // 3. Process Denial Letter
    console.log('📤 Uploading claim denial letter to Cloudinary...');
    const denialMime = denialFile.mimetype;
    const denialType = denialMime === 'application/pdf' ? 'pdf' : 'image';
    const denialCloudinary = await uploadToCloudinary(
      denialFile.buffer,
      'appeals-denials',
      denialType === 'pdf' ? 'raw' : 'image'
    );
    const denialFileUrl = denialCloudinary.url;
    const denialFileName = denialFile.originalname;

    console.log('🔍 Extracting text from denial letter...');
    const denialOcr = await extractText(denialFile.buffer, denialMime);
    const denialText = denialOcr.text;

    // Create draft appeal record
    const appeal = await Appeal.create({
      user: req.user._id,
      policyFileName,
      denialFileName,
      policyFileUrl,
      denialFileUrl,
      status: 'processing',
    });

    if (!policyText || policyText.length < 50) {
      appeal.status = 'failed';
      appeal.errorMessage = 'Could not extract text from the policy document. Please ensure it is clear.';
      await appeal.save();
      return res.status(422).json({ success: false, message: appeal.errorMessage, data: appeal });
    }

    if (!denialText || denialText.length < 50) {
      appeal.status = 'failed';
      appeal.errorMessage = 'Could not extract text from the claim denial letter. Please ensure it is clear.';
      await appeal.save();
      return res.status(422).json({ success: false, message: appeal.errorMessage, data: appeal });
    }

    // 4. Generate appeal using AI
    console.log('🤖 Invoking Gemini AI for claim denial appeal analysis...');
    try {
      const appealResult = await generateAppealLetter(policyText, denialText);
      appeal.denialReason = appealResult.denialReason;
      appeal.policyAnalysis = appealResult.policyAnalysis;
      appeal.keyArguments = appealResult.keyArguments;
      appeal.appealLetter = appealResult.appealLetter;
      appeal.status = 'completed';
      await appeal.save();

      res.status(201).json({
        success: true,
        message: 'Claims appeal letter generated successfully',
        data: appeal,
      });
    } catch (aiError) {
      appeal.status = 'failed';
      appeal.errorMessage = aiError.message || 'AI appeal generation failed';
      await appeal.save();
      res.status(500).json({ success: false, message: appeal.errorMessage, data: appeal });
    }
  } catch (error) {
    console.error('❌ Claims Appeal Error:', error.message);
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user claims appeals
// @route   GET /api/appeal
// @access  Private
const getAppeals = async (req, res) => {
  try {
    const appeals = await Appeal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: appeals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single claims appeal details
// @route   GET /api/appeal/:id
// @access  Private
const getAppealById = async (req, res) => {
  try {
    const appeal = await Appeal.findOne({ _id: req.params.id, user: req.user._id });
    if (!appeal) {
      return res.status(404).json({ success: false, message: 'Appeal details not found' });
    }
    res.json({ success: true, data: appeal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete claims appeal
// @route   DELETE /api/appeal/:id
// @access  Private
const deleteAppeal = async (req, res) => {
  try {
    const appeal = await Appeal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!appeal) {
      return res.status(404).json({ success: false, message: 'Appeal details not found' });
    }
    res.json({ success: true, message: 'Appeal deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAppeal,
  getAppeals,
  getAppealById,
  deleteAppeal,
};
