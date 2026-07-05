// backend/controllers/hrController.js
const User = require('../models/User');
const Policy = require('../models/Policy');
const QuestionLog = require('../models/QuestionLog');
const { answerBenefitQuestion } = require('../services/aiService');

// Helper to check if user is HR Admin
const checkHRAdmin = (req, res) => {
  if (req.user.role !== 'hr-admin') {
    res.status(403);
    throw new Error('Access denied. HR Admin privileges required.');
  }
};

// Helper to check if user is Employee
const checkEmployee = (req, res) => {
  if (req.user.role !== 'employee') {
    res.status(403);
    throw new Error('Access denied. Employee privileges required.');
  }
};

// @desc    Add a new employee to the organization
// @route   POST /api/hr/employees
// @access  Private (HR Admin)
const addEmployee = async (req, res) => {
  try {
    checkHRAdmin(req, res);

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please enter name, email, and password');
    }

    // Check duplicate
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('A user already exists with this email');
    }

    const employee = await User.create({
      name,
      email,
      password,
      role: 'employee',
      organizationName: req.user.organizationName || 'Our Organization',
      organizationAdmin: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Employee registered successfully',
      data: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        organizationName: employee.organizationName,
      },
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all employees in the organization
// @route   GET /api/hr/employees
// @access  Private (HR Admin)
const getEmployees = async (req, res) => {
  try {
    checkHRAdmin(req, res);
    const employees = await User.find({
      role: 'employee',
      organizationAdmin: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: employees });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete an employee account
// @route   DELETE /api/hr/employees/:id
// @access  Private (HR Admin)
const deleteEmployee = async (req, res) => {
  try {
    checkHRAdmin(req, res);
    const employee = await User.findOneAndDelete({
      _id: req.params.id,
      role: 'employee',
      organizationAdmin: req.user._id,
    });

    if (!employee) {
      res.status(404);
      throw new Error('Employee not found in your organization');
    }

    res.json({ success: true, message: 'Employee removed successfully' });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all corporate policies for the logged-in employee
// @route   GET /api/hr/policies
// @access  Private (Employee)
const getEmployeePolicies = async (req, res) => {
  try {
    checkEmployee(req, res);
    // Find benefit policies uploaded by the employee's HR Admin
    const policies = await Policy.find({
      user: req.user.organizationAdmin,
      isOrganizationBenefit: true,
      status: 'completed',
    }).select('originalFileName simplifiedSummary.policyType createdAt');

    res.json({ success: true, data: policies });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Ask a benefits question about a policy using Gemini AI
// @route   POST /api/hr/policies/:id/ask
// @access  Private (Employee)
const askBenefitQuestion = async (req, res) => {
  try {
    checkEmployee(req, res);
    const { question } = req.body;
    if (!question) {
      res.status(400);
      throw new Error('Please enter a question');
    }

    // Verify policy belongs to employee's HR Admin and is an org benefit
    const policy = await Policy.findOne({
      _id: req.params.id,
      user: req.user.organizationAdmin,
      isOrganizationBenefit: true,
    });

    if (!policy) {
      res.status(404);
      throw new Error('Benefits policy not found');
    }

    console.log(`🤖 Answering employee question about benefits: "${question}"`);
    const answer = await answerBenefitQuestion(policy.extractedText, question);

    // Save QA transaction log
    await QuestionLog.create({
      user: req.user._id,
      policy: policy._id,
      question,
      answer,
    });

    res.json({
      success: true,
      data: {
        question,
        answer,
      },
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get HR Admin Dashboard metrics and query log audits
// @route   GET /api/hr/stats
// @access  Private (HR Admin)
const getHRStats = async (req, res) => {
  try {
    checkHRAdmin(req, res);
    
    // Count stats
    const employeeCount = await User.countDocuments({
      role: 'employee',
      organizationAdmin: req.user._id,
    });

    const policyCount = await Policy.countDocuments({
      user: req.user._id,
      isOrganizationBenefit: true,
    });

    // Find all policy IDs owned by this HR Admin
    const policies = await Policy.find({ user: req.user._id, isOrganizationBenefit: true });
    const policyIds = policies.map((p) => p._id);

    const questionCount = await QuestionLog.countDocuments({
      policy: { $in: policyIds },
    });

    // Recent questions log
    const recentQuestions = await QuestionLog.find({
      policy: { $in: policyIds },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .populate('policy', 'originalFileName');

    res.json({
      success: true,
      data: {
        employeeCount,
        policyCount,
        questionCount,
        recentQuestions,
      },
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addEmployee,
  getEmployees,
  deleteEmployee,
  getEmployeePolicies,
  askBenefitQuestion,
  getHRStats,
};
