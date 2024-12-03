import express from "express";
const router = express.Router();
import declPrealStorageCntrl from "../../../controllers/SiteDetails/DP/DpStorageCntrl.js";

// Route for downloading a file (should be POST as it can involve file data)
router.post('/download-dp', declPrealStorageCntrl.downloadFileController);

// Route for getting public URLs for DP files (GET is correct here)
router.get('/get-dp-files', declPrealStorageCntrl.getPublicUrlController);

// Route for uploading a DP file (should be POST to handle file uploads)
router.post('/upload-dp', declPrealStorageCntrl.uploadFileController);

// Route for generating a signed URL for a DP file (POST is more appropriate for this action)
router.post('/generate-dp-files', declPrealStorageCntrl.generateSignedUrlController);

export default router;
