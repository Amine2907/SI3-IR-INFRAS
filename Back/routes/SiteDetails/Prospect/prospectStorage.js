import express from "express";
import prospectStorageCntrl from "../../../controllers/SiteDetails/Prospect/ProspectStorageCntrl.js";
import multer from "multer";

const router = express.Router();

// Configure Multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for uploading prospect files
router.post(
  "/upload-prospect",
  upload.single("file"), // Multer middleware to handle single file upload
  prospectStorageCntrl.uploadFileController // Controller to handle the upload
);

// Route for generating a signed URL for a prospect file
router.post(
  "/generate-prospect-files",
  prospectStorageCntrl.generateSignedUrlController // Controller for signed URLs
);

// Route for downloading a prospect file
router.get("/download-prospect", prospectStorageCntrl.downloadFileController);
// Route for retrieving public URLs of prospect files
router.post(
  "/get-prospect-files",
  prospectStorageCntrl.getPublicUrlController // Controller for fetching public URLs
);
export default router;
