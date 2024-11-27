/**
 * This module defines routes based on user roles
 * Routes are protected by the roleMiddleware function which verifies the user's role
 * before allowing access to the route
 */
import express from 'express';
import roleMiddleware from '../../middleware/roleMiddleware.js'
const router = express.Router();
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
export default router;
