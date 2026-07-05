// backend/routes/hrRoutes.js
const express = require('express');
const router = express.Router();
const {
  addEmployee,
  getEmployees,
  deleteEmployee,
  getEmployeePolicies,
  askBenefitQuestion,
  getHRStats,
} = require('../controllers/hrController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// HR Admin Employee Management Routes
router.post('/employees', addEmployee);
router.get('/employees', getEmployees);
router.delete('/employees/:id', deleteEmployee);
router.get('/stats', getHRStats);

// Employee benefits portal Routes
router.get('/policies', getEmployeePolicies);
router.post('/policies/:id/ask', askBenefitQuestion);

module.exports = router;
