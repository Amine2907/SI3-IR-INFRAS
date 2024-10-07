import express from 'express';
import { signUp, signIn, signOut } from '../controllers/authController.js';

const router = express.Router();

// Authentication Routes
router.post('/signup', signUp);  // Sign up Route
router.post('/signin', signIn);  // Sign in Route
router.post('/signout', signOut); // Sign out Route

export default router;