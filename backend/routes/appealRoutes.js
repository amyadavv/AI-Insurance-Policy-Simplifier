// backend/routes/appealRoutes.js
const express = require('express');
const router = express.Router();
const {
  createAppeal,
  getAppeals,
  getAppealById,
  deleteAppeal,
} = require('../controllers/appealController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes require authentication
router.use(protect);

// Upload denial and policy to generate appeal letter
router.post(
  '/upload',
  upload.fields([
    { name: 'policy', maxCount: 1 },
    { name: 'denial', maxCount: 1 },
  ]),
  createAppeal
);

// Get all appeals
router.get('/', getAppeals);

// Get a single appeal
router.get('/:id', getAppealById);

// Delete an appeal
router.delete('/:id', deleteAppeal);

module.exports = router;
