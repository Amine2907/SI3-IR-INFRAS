import express from "express";
const router = express.Router();
import devisStorageCntrl from "../../../controllers/SiteDetails/Devis/DevisStorageCntrl.js";
import multer from "multer";
// Configure Multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for uploading devis files
router.post(
  "/upload-devis",
  upload.single("file"), // Multer middleware to handle single file upload
  devisStorageCntrl.uploadFileController // Controller to handle the upload
);

// Route for generating a signed URL for a devis file
router.post(
  "/generate-devis-files",
  devisStorageCntrl.generateSignedUrlController // Controller for signed URLs
);

// Route for downloading a devis file
router.get("/download-devis", devisStorageCntrl.downloadFileController);
// Route for retrieving public URLs of devis files
router.post(
  "/get-devis-files",
  devisStorageCntrl.getFilesByDevisController // Controller for fetching public URLs
);
// Route for deleting devis file 
router.post('/delete-devis-file', devisStorageCntrl.deleteFileController);

export default router;



