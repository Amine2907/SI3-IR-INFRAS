import express from "express";
const router = express.Router();
import declPrealStorageCntrl from "../../../controllers/SiteDetails/DP/DpStorageCntrl.js";

router.post('/download-dp',declPrealStorageCntrl.downloadFileController);
router.get('/get-dp-files',declPrealStorageCntrl.getPublicUrlController);
router.get('/upload-dp',declPrealStorageCntrl.uploadFileController);
router.get('/generate-dp-files',declPrealStorageCntrl.generateSignedUrlController);
export default router ; 