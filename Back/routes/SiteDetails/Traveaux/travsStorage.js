import express from "express";
const router = express.Router();
import travStorage from "../../../storage/Traveaux/travStorage.js";
// Route for downloading a file (should be POST as it can involve file data)
router.post('/download-trav', travStorage.downloadFileController);

// Route for getting public URLs for DP files (GET is correct here)
router.get('/get-trav-files', travStorage.getPublicUrlController);

// Route for uploading a DP file (should be POST to handle file uploads)
router.post('/upload-trav', travStorage.uploadFileController);

// Route for generating a signed URL for a DP file (POST is more appropriate for this action)
router.post('/generate-trav-files', travStorage.generateSignedUrlController);

export default router;
