import express from "express";
const router = express.Router();
import preEtudeStorageCntrl from "../../../controllers/SiteDetails/PreEtude/preEtudeStorageCntrl.js";
// Route for downloading a file (should be POST as it can involve file data)
router.post('/download-preEtude', preEtudeStorageCntrl.downloadFileController);

// Route for getting public URLs for DP files (GET is correct here)
router.get('/get-preEtude-files', preEtudeStorageCntrl.getPublicUrlController);

// Route for uploading a DP file (should be POST to handle file uploads)
router.post('/upload-preEtude', preEtudeStorageCntrl.uploadFileController);

// Route for generating a signed URL for a DP file (POST is more appropriate for this action)
router.post('/generate-preEtude-files', preEtudeStorageCntrl.generateSignedUrlController);

export default router;
