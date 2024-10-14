const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middleware/roleMiddleware');

// Define routes based on user roles
router.get('/system-admin', roleMiddleware(['system admin']), (req, res) => {
  res.json({ message: 'Welcome to the System Admin Dashboard' });
});

router.get('/company-admin', roleMiddleware(['company admin']), (req, res) => {
  res.json({ message: 'Welcome to the Company Admin Dashboard' });
});

router.get('/manager', roleMiddleware(['manager']), (req, res) => {
  res.json({ message: 'Welcome to the Manager Dashboard' });
});

router.get('/employee', roleMiddleware(['employee']), (req, res) => {
  res.json({ message: 'Welcome to the Employee Dashboard' });
});

router.get('/visitor', roleMiddleware(['visitor']), (req, res) => {
  res.json({ message: 'Welcome to the Visitor Dashboard' });
});

module.exports = router;
