import express from "express";
import mesStorageCntrl from "../../../controllers/SiteDetails/MES/MesStorageCntrl.js";
import multer from "multer";
const router = express.Router();

// Configure Multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for uploading mes files
router.post(
  "/upload-mes",
  upload.single("file"), // Multer middleware to handle single file upload
  mesStorageCntrl.uploadFileController // Controller to handle the upload
);

// Route for generating a signed URL for a mes file
router.post(
  "/generate-mes-files",
  mesStorageCntrl.generateSignedUrlController // Controller for signed URLs
);

// Route for downloading a mes file
router.get("/download-mes", mesStorageCntrl.downloadFileController);
// Route for retrieving public URLs of mes files
router.post(
  "/get-mes-files",
  mesStorageCntrl.getFilesByMesController // Controller for fetching public URLs
);
// Route for deleting mes file 
router.post('/delete-mes-file', mesStorageCntrl.deleteFileController);

export default router;


