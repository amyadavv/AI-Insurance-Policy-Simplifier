// backend/routes/comparisonRoutes.js
const express = require('express');
const router = express.Router();
const {
  createComparison,
  getComparisons,
  getComparisonById,
  deleteComparison,
} = require('../controllers/comparisonController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes require authentication
router.use(protect);

// Upload two policies for side-by-side comparison
router.post(
  '/upload',
  upload.fields([
    { name: 'policyA', maxCount: 1 },
    { name: 'policyB', maxCount: 1 },
  ]),
  createComparison
);

// Get all comparisons
router.get('/', getComparisons);

// Get a single comparison
router.get('/:id', getComparisonById);

// Delete a comparison
router.delete('/:id', deleteComparison);

module.exports = router;
