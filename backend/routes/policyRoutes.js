// backend/routes/policyRoutes.js
const express = require('express');
const router = express.Router();
const {
  uploadPolicy,
  getPolicies,
  getPolicyById,
  deletePolicy,
  toggleBookmark,
  reSimplifyPolicy,
  getDashboardStats,
} = require('../controllers/policyController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes require authentication
router.use(protect);

// Dashboard stats (must be before /:id to avoid conflict)
router.get('/stats', getDashboardStats);

// Upload a policy
router.post('/upload', upload.single('document'), uploadPolicy);

// Get all policies
router.get('/', getPolicies);

// Get a single policy
router.get('/:id', getPolicyById);

// Delete a policy
router.delete('/:id', deletePolicy);

// Toggle bookmark
router.put('/:id/bookmark', toggleBookmark);

// Re-simplify a policy
router.post('/:id/re-simplify', reSimplifyPolicy);

module.exports = router;
