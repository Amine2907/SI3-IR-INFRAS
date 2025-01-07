import express from "express";
import declPrealStorageCntrl from "../../../controllers/SiteDetails/DP/DpStorageCntrl.js";
import multer from "multer";
const router = express.Router();

// Configure Multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for uploading dp files
router.post(
  "/upload-dp",
  upload.single("file"), // Multer middleware to handle single file upload
  declPrealStorageCntrl.uploadFileController // Controller to handle the upload
);

// Route for generating a signed URL for a dp file
router.post(
  "/generate-dp-files",
  declPrealStorageCntrl.generateSignedUrlController // Controller for signed URLs
);

// Route for downloading a dp file
router.get("/download-dp", declPrealStorageCntrl.downloadFileController);
// Route for retrieving public URLs of dp files
router.post(
  "/get-dp-files",
  declPrealStorageCntrl.getFilesByDpController // Controller for fetching public URLs
);
// Route for deleting dp file 
router.post('/delete-dp-file', declPrealStorageCntrl.deleteFileController);

export default router;



