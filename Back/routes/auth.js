/**
 * @module Routes/auth
 * This module contains the routes for authentication
 * It exports a router with the following routes:
 * - POST /signup: Signs up a user
 * - POST /signin: Signs in a user
 * - POST /signout: Signs out a user
 * - POST /reset-password: Resets a user's password
 * - POST /confirm-reset-password: Confirms a password reset
 */
import express from 'express';
import { signUp, signIn, signOut , resetPassword , handleUpdatePassword } from '../controllers/authController.js';
const router = express.Router();

// Authentication Routes
router.post('/signup', signUp);  // Sign up Route
router.post('/signin', signIn);  // Sign in Route
router.post('/signout', signOut); // Sign out Route
router.post('/reset-password',resetPassword); //Reset Password Route
router.post('/update-password', handleUpdatePassword); // confirm reset password
export default router;