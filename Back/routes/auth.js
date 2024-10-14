import express from 'express';
import { signUp, signIn, signOut , resetPassword , confirmResetPassword } from '../Controllers/authController.js';

const router = express.Router();

// Authentication Routes
router.post('/signup', signUp);  // Sign up Route
router.post('/signin', signIn);  // Sign in Route
router.post('/signout', signOut); // Sign out Route
router.post('/reset-password',resetPassword); //Reset Password Route
router.post('/confirm-reset-password', confirmResetPassword); //Confirm Reset Password Route
export default router;