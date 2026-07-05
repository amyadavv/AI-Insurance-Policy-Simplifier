// backend/controllers/policyController.js
const Policy = require('../models/Policy');
const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinaryService');
const { extractText } = require('../services/ocrService');
const { simplifyPolicy } = require('../services/aiService');

// @desc    Upload and process a policy document
// @route   POST /api/policy/upload
// @access  Private
const uploadPolicy = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a file');
    }

    const { originalname, mimetype, buffer, size } = req.file;

    // Determine file type
    const fileType = mimetype === 'application/pdf' ? 'pdf' : 'image';

    // Step 1: Upload to Cloudinary
    console.log('📤 Step 1: Uploading to Cloudinary...');
    const cloudinaryResult = await uploadToCloudinary(
      buffer,
      'insurance-policies',
      fileType === 'pdf' ? 'raw' : 'image'
    );

    // Step 2: Create policy record with 'uploaded' status
    const policy = await Policy.create({
      user: req.user._id,
      originalFileName: originalname,
      fileType,
      fileUrl: cloudinaryResult.url,
      cloudinaryPublicId: cloudinaryResult.publicId,
      fileSize: size,
      status: 'extracting',
      tags: req.body.tags ? req.body.tags.split(',').map((t) => t.trim()) : [],
    });

    // Step 3: Extract text using OCR
    console.log('🔍 Step 2: Extracting text...');
    policy.status = 'extracting';
    await policy.save();

    const ocrResult = await extractText(buffer, mimetype);
    policy.extractedText = ocrResult.text;
    policy.ocrConfidence = ocrResult.confidence;

    // Check if enough text was extracted
    if (!ocrResult.text || ocrResult.text.length < 50) {
      policy.status = 'failed';
      policy.errorMessage =
        'Could not extract enough text from the document. Please ensure the document is clear and readable.';
      await policy.save();

      return res.status(422).json({
        success: false,
        message: policy.errorMessage,
        data: policy,
      });
    }

    // Step 4: Simplify with AI
    console.log('🤖 Step 3: Simplifying with AI...');
    policy.status = 'simplifying';
    await policy.save();

    const simplifiedData = await simplifyPolicy(ocrResult.text);
    policy.simplifiedSummary = simplifiedData;
    policy.status = 'completed';
    await policy.save();

    // Step 5: Update user's policy count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { policiesCount: 1 },
    });

    console.log('✅ Policy processing complete!');

    res.status(201).json({
      success: true,
      message: 'Policy uploaded and simplified successfully',
      data: policy,
    });
  } catch (error) {
    console.error('❌ Upload error:', error.message);
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({ success: false, message: error.message });
  }
};

// @desc    Get all policies for logged-in user
// @route   GET /api/policy
// @access  Private
const getPolicies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    // Build query
    const query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    if (req.query.isBookmarked === 'true') {
      query.isBookmarked = true;
    }

    if (search) {
      query.$or = [
        { originalFileName: { $regex: search, $options: 'i' } },
        { 'simplifiedSummary.policyType': { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const policies = await Policy.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-extractedText'); // Exclude large text field from list

    const total = await Policy.countDocuments(query);

    res.json({
      success: true,
      data: policies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single policy by ID
// @route   GET /api/policy/:id
// @access  Private
const getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!policy) {
      res.status(404);
      throw new Error('Policy not found');
    }

    res.json({
      success: true,
      data: policy,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({ success: false, message: error.message });
  }
};

// @desc    Delete a policy
// @route   DELETE /api/policy/:id
// @access  Private
const deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!policy) {
      res.status(404);
      throw new Error('Policy not found');
    }

    // Delete from Cloudinary
    try {
      const resourceType = policy.fileType === 'pdf' ? 'raw' : 'image';
      await deleteFromCloudinary(policy.cloudinaryPublicId, resourceType);
    } catch (cloudError) {
      console.error('Cloudinary delete warning:', cloudError.message);
      // Continue even if Cloudinary delete fails
    }

    // Delete from database
    await Policy.deleteOne({ _id: policy._id });

    // Update user's policy count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { policiesCount: -1 },
    });

    res.json({
      success: true,
      message: 'Policy deleted successfully',
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({ success: false, message: error.message });
  }
};

// @desc    Toggle bookmark on a policy
// @route   PUT /api/policy/:id/bookmark
// @access  Private
const toggleBookmark = async (req, res) => {
  try {
    const policy = await Policy.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!policy) {
      res.status(404);
      throw new Error('Policy not found');
    }

    policy.isBookmarked = !policy.isBookmarked;
    await policy.save();

    res.json({
      success: true,
      data: { isBookmarked: policy.isBookmarked },
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({ success: false, message: error.message });
  }
};

// @desc    Re-simplify a policy (retry AI processing)
// @route   POST /api/policy/:id/re-simplify
// @access  Private
const reSimplifyPolicy = async (req, res) => {
  try {
    const policy = await Policy.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!policy) {
      res.status(404);
      throw new Error('Policy not found');
    }

    if (!policy.extractedText || policy.extractedText.length < 50) {
      res.status(400);
      throw new Error('Not enough extracted text to simplify');
    }

    policy.status = 'simplifying';
    await policy.save();

    const simplifiedData = await simplifyPolicy(policy.extractedText);
    policy.simplifiedSummary = simplifiedData;
    policy.status = 'completed';
    policy.errorMessage = '';
    await policy.save();

    res.json({
      success: true,
      message: 'Policy re-simplified successfully',
      data: policy,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats for logged-in user
// @route   GET /api/policy/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [totalPolicies, completedPolicies, failedPolicies, bookmarkedPolicies] =
      await Promise.all([
        Policy.countDocuments({ user: userId }),
        Policy.countDocuments({ user: userId, status: 'completed' }),
        Policy.countDocuments({ user: userId, status: 'failed' }),
        Policy.countDocuments({ user: userId, isBookmarked: true }),
      ]);

    // Get policy type distribution
    const policyTypes = await Policy.aggregate([
      { $match: { user: userId, status: 'completed' } },
      {
        $group: {
          _id: '$simplifiedSummary.policyType',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent policies
    const recentPolicies = await Policy.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('originalFileName status simplifiedSummary.policyType createdAt isBookmarked');

    res.json({
      success: true,
      data: {
        totalPolicies,
        completedPolicies,
        failedPolicies,
        bookmarkedPolicies,
        policyTypes,
        recentPolicies,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadPolicy,
  getPolicies,
  getPolicyById,
  deletePolicy,
  toggleBookmark,
  reSimplifyPolicy,
  getDashboardStats,
};
