import express from 'express';
import ReportingController from '../../controllers/ReportingGlobal/reportingController.js';
const router = express.Router();

router.get('/download-excel/:type', ReportingController.downloadExcel);

export default router;