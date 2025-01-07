import express from "express";
import multer from "multer";
import paiementStorageCntrl from "../../../../controllers/SiteDetails/Reglement/Paiement/PaiementStorageCntrl.js";
const router = express.Router();

// Configure Multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for uploading paie files
router.post(
  "/upload-paie",
  upload.single("file"), // Multer middleware to handle single file upload
  paiementStorageCntrl.uploadFileController // Controller to handle the upload
);

// Route for generating a signed URL for a paie file
router.post(
  "/generate-paie-files",
  paiementStorageCntrl.generateSignedUrlController // Controller for signed URLs
);

// Route for downloading a paie file
router.get("/download-paie", paiementStorageCntrl.downloadFileController);
// Route for retrieving public URLs of paie files
router.post(
  "/get-paie-files",
  paiementStorageCntrl.getFilesByPaieController // Controller for fetching public URLs
);
// Route for deleting paie file 
router.post('/delete-paie-file', paiementStorageCntrl.deleteFileController);

export default router;
