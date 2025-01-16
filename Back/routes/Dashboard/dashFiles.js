import express from 'express';
import DashFilesController from '../../controllers/Dashboard/filesController.js';
const router = express.Router();

// Route to get DR data
router.get('/dr-data', DashFilesController.getDrData);

// Route to download DR data as an Excel file
router.get('/download-dr-excel', DashFilesController.downloadDrExcel);

export default router;