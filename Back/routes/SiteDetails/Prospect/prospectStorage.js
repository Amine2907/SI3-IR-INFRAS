import express from "express";
const router = express.Router();
import prospectStorageCntrl from "../../../controllers/SiteDetails/Prospect/ProspectStorageCntrl.js";

router.post('/download-prospect',prospectStorageCntrl.downloadFileController);
router.get('/get-prospect-files',prospectStorageCntrl.getPublicUrlController);
router.get('/upload-prospect',prospectStorageCntrl.uploadFileController);
router.get('/generate-prospect-files',prospectStorageCntrl.generateSignedUrlController);
export default router ; 