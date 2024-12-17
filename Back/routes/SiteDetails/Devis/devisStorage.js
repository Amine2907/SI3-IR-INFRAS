import express from "express";
const router = express.Router();
import devisStorageCntrl from "../../../controllers/SiteDetails/Devis/DevisStorageCntrl.js";
// Route for downloading a file (should be POST as it can involve file data)
router.post('/download-devis', devisStorageCntrl.downloadFileController);

// Route for getting public URLs for DP files (GET is correct here)
router.get('/get-devis-files', devisStorageCntrl.getPublicUrlController);

// Route for uploading a DP file (should be POST to handle file uploads)
router.post('/upload-devis', devisStorageCntrl.uploadFileController);

// Route for generating a signed URL for a DP file (POST is more appropriate for this action)
router.post('/generate-devis-files', devisStorageCntrl.generateSignedUrlController);

export default router;
