import express from "express";
const router = express.Router();
import prospectStorageCntrl from "../../../controllers/SiteDetails/Prospect/ProspectStorageCntrl.js";

// Route for file download (POST is more appropriate for handling data)
router.post('/download-prospect', prospectStorageCntrl.downloadFileController);

// Route for retrieving public URLs of prospect files (GET is correct here)
router.get('/get-prospect-files', prospectStorageCntrl.getPublicUrlController);

// Route for uploading prospect files (POST is correct here)
router.post('/upload-prospect', prospectStorageCntrl.uploadFileController);

// Route for generating a signed URL for a prospect file (POST is more appropriate)
router.post('/generate-prospect-files', prospectStorageCntrl.generateSignedUrlController);

export default router ;