import express from 'express';
import settingsController from '../controllers/settingsController.js';
// import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/account', authMiddleware, settingsController.getAccountInfo);
router.put('/account/password', authMiddleware, settingsController.updatePassword);
router.get('/users', authMiddleware, settingsController.listUsers);
router.get('/companies', authMiddleware, settingsController.listCompanies);

export default router;