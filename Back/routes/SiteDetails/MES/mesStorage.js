import express from "express";
const router = express.Router();
import mesStorageCntrl from "../../../controllers/SiteDetails/MES/MesStorageCntrl.js";
// Route for downloading a file (should be POST as it can involve file data)
router.post('/download-mes', mesStorageCntrl.downloadFileController);

// Route for getting public URLs for DP files (GET is correct here)
router.get('/get-mes-files', mesStorageCntrl.getPublicUrlController);

// Route for uploading a DP file (should be POST to handle file uploads)
router.post('/upload-mes', mesStorageCntrl.uploadFileController);

// Route for generating a signed URL for a DP file (POST is more appropriate for this action)
router.post('/generate-mes-files', mesStorageCntrl.generateSignedUrlController);

export default router;
