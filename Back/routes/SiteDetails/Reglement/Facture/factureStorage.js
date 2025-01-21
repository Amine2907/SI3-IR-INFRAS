import express from "express";
const router = express.Router();
import factureStorageCntrl from "../../../../controllers/SiteDetails/Reglement/Facture/FactureStorageCntrl.js";
import express from "express";
import multer from "multer";

// Configure Multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for uploading facture files
router.post(
  "/upload-facture",
  upload.single("file"), // Multer middleware to handle single file upload
  factureStorageCntrl.uploadFileController // Controller to handle the upload
);

// Route for generating a signed URL for a facture file
router.post(
  "/generate-facture-files",
  factureStorageCntrl.generateSignedUrlController // Controller for signed URLs
);

// Route for downloading a facture file
router.get("/download-facture", factureStorageCntrl.downloadFileController);
// Route for retrieving public URLs of facture files
router.post(
  "/get-facture-files",
  factureStorageCntrl.getFilesByfactureController // Controller for fetching public URLs
);
// Route for deleting facture file 
router.post('/delete-facture-file', factureStorageCntrl.deleteFileController);

export default router;
