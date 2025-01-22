import express from 'express';
import DashFilesController from '../../controllers/Dashboard/filesController.js';
const router = express.Router();

router.get('/download-excel/:type', DashFilesController.downloadExcel);

export default router;