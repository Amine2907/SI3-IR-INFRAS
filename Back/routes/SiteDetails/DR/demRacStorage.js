import express from "express";
import demRacStorageCntrl from "../../../controllers/SiteDetails/DR/DrStorageController.js";
import multer from "multer";
const router = express.Router();

// Configure Multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for uploading demracs files
router.post(
  "/upload-demracs",
  upload.single("file"), // Multer middleware to handle single file upload
  demRacStorageCntrl.uploadFileController // Controller to handle the upload
);

// Route for generating a signed URL for a demracs file
router.post(
  "/generate-demracs-files",
  demRacStorageCntrl.generateSignedUrlController // Controller for signed URLs
);

// Route for downloading a demracs file
router.get("/download-demracs", demRacStorageCntrl.downloadFileController);
// Route for retrieving public URLs of demracs files
router.post(
  "/get-demracs-files",
  demRacStorageCntrl.getFilesByDemRacController // Controller for fetching public URLs
);
// Route for deleting demracs file 
router.post('/delete-demracs-file', demRacStorageCntrl.deleteFileController);

export default router;


