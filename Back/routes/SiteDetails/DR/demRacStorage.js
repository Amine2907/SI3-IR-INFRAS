import express from "express";
const router = express.Router();
import demRacStorageCntrl from "../../../controllers/SiteDetails/DR/DrStorageController.js";
// Route for downloading a file (should be POST as it can involve file data)
router.post('/download-demrac', demRacStorageCntrl.downloadFileController);

// Route for getting public URLs for DP files (GET is correct here)
router.get('/get-demrac-files', demRacStorageCntrl.getPublicUrlController);

// Route for uploading a DP file (should be POST to handle file uploads)
router.post('/upload-demrac', demRacStorageCntrl.uploadFileController);

// Route for generating a signed URL for a DP file (POST is more appropriate for this action)
router.post('/generate-demrac-files', demRacStorageCntrl.generateSignedUrlController);

export default router;
