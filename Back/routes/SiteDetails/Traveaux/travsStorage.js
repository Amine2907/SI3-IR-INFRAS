import express from "express";
import traveauxStorageCntrl from "../../../controllers/SiteDetails/Traveaux/TraveauxStorageCntrl.js";
import multer from "multer";

const router = express.Router();

// Configure Multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for uploading trav files
router.post(
  "/upload-trav",
  upload.single("file"), // Multer middleware to handle single file upload
  traveauxStorageCntrl.uploadFileController // Controller to handle the upload
);

// Route for generating a signed URL for a trav file
router.post(
  "/generate-trav-files",
  traveauxStorageCntrl.generateSignedUrlController // Controller for signed URLs
);

// Route for downloading a trav file
router.get("/download-trav", traveauxStorageCntrl.downloadFileController);
// Route for retrieving public URLs of trav files
router.post(
  "/get-trav-files",
  traveauxStorageCntrl.getFilesByTravController // Controller for fetching public URLs
);
// Route for deleting trav file 
router.post('/delete-trav-file', traveauxStorageCntrl.deleteFileController);

export default router;
