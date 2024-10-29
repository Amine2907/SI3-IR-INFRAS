/**
 * This file contains the routes for the /api/settings endpoint
 * - /account: gets the information of the current user
 * - /account/password: updates the password of the current user
 * - /users: lists all the users in the database
 * - /companies: lists all the companies in the database
 */
import express from 'express';
import settingsController from '../controllers/settingsController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/account/:userId', authMiddleware, settingsController.getAccountInfo);
router.put('/account/:userId',authMiddleware,settingsController.updateUserAccount);
router.put('/account/password/:userId', authMiddleware, settingsController.updatePassword);
router.get('/users', authMiddleware, settingsController.listUsers);
export default router;