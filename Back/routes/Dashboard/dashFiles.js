import express from 'express';
import DashFilesController from '../../controllers/Dashboard/filesController.js';
const router = express.Router();

router.get('/dr-data', DashFilesController.getDrData);
// router.get('/download-dr-excel', DashFilesController.downloadExcel);
// router.get('/download-devisRecu-excel', DashFilesController.downloadExcel);
router.get('/download-excel/:type', DashFilesController.downloadExcel);

export default router;