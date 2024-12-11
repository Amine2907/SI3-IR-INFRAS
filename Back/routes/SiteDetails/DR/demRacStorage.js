import express from "express";
const router = express.Router();
import demRacStorageCntrl from "../../../controllers/SiteDetails/DR/DrStorageController.js";
// Route for downloading a file (should be POST as it can involve file data)
router.post('/download-preEtude', demRacStorageCntrl.downloadFileController);

// Route for getting public URLs for DP files (GET is correct here)
router.get('/get-preEtude-files', demRacStorageCntrl.getPublicUrlController);

// Route for uploading a DP file (should be POST to handle file uploads)
router.post('/upload-preEtude', demRacStorageCntrl.uploadFileController);

// Route for generating a signed URL for a DP file (POST is more appropriate for this action)
router.post('/generate-preEtude-files', demRacStorageCntrl.generateSignedUrlController);

export default router;
