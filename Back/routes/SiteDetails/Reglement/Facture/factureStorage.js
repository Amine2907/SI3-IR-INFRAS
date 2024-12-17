import express from "express";
const router = express.Router();
import factureStorageCntrl from "../../../../controllers/SiteDetails/Reglement/Facture/FactureStorageCntrl.js";
// Route for downloading a file (should be POST as it can involve file data)
router.post('/download-facture', factureStorageCntrl.downloadFileController);

// Route for getting public URLs for DP files (GET is correct here)
router.get('/get-facture-files', factureStorageCntrl.getPublicUrlController);

// Route for uploading a DP file (should be POST to handle file uploads)
router.post('/upload-facture', factureStorageCntrl.uploadFileController);

// Route for generating a signed URL for a DP file (POST is more appropriate for this action)
router.post('/generate-facture-files', factureStorageCntrl.generateSignedUrlController);

export default router;
