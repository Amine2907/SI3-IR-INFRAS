import express from 'express';
import ReportingController from '../../controllers/ReportingGlobal/reportingController.js';
const router = express.Router();

router.get('/download-excel/:type', ReportingController.downloadExcel);
router.get('/reports', ReportingController.listReports);
router.get('/reports/signed-url/:filename', ReportingController.getSignedUrl);
router.get('/generate-report', ReportingController.generateReportManually);
router.get('/download-report', ReportingController.downloadFileController);

export default router;