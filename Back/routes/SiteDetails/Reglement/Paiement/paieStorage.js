import express from "express";
const router = express.Router();
import paiementStorageCntrl from "../../../../controllers/SiteDetails/Reglement/Paiement/PaiementStorageCntrl.js";
// Route for downloading a file (should be POST as it can involve file data)
router.post('/download-paie', paiementStorageCntrl.downloadFileController);

// Route for getting public URLs for DP files (GET is correct here)
router.get('/get-paie-files', paiementStorageCntrl.getPublicUrlController);

// Route for uploading a DP file (should be POST to handle file uploads)
router.post('/upload-paie', paiementStorageCntrl.uploadFileController);

// Route for generating a signed URL for a DP file (POST is more appropriate for this action)
router.post('/generate-paie-files', paiementStorageCntrl.generateSignedUrlController);

export default router;
