import express from "express";
import preEtudeStorageCntrl from '../../../controllers/SiteDetails/PreEtude/preEtudeStorageCntrl.js';
import multer from "multer";
const router = express.Router();

// Configure Multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for uploading preEtude files
router.post(
  "/upload-preEtude",
  upload.single("file"), // Multer middleware to handle single file upload
  preEtudeStorageCntrl.uploadFileController // Controller to handle the upload
);

// Route for generating a signed URL for a preEtude file
router.post(
  "/generate-preEtude-files",
  preEtudeStorageCntrl.generateSignedUrlController // Controller for signed URLs
);

// Route for downloading a preEtude file
router.get("/download-preEtude", preEtudeStorageCntrl.downloadFileController);
// Route for retrieving public URLs of preEtude files
router.post(
  "/get-preEtude-files",
  preEtudeStorageCntrl.getFilesByPreEtudeController // Controller for fetching public URLs
);
// Route for deleting preEtude file 
router.post('/delete-preEtude-file', preEtudeStorageCntrl.deleteFileController);

export default router;

