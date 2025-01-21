import factureStorage from "../../../../storage/Reglement/Facture/factureStorage.js";
// Controller to handle file uploads
const uploadFileController = async (req, res) => {
  try {
    const { file } = req;  // Access the uploaded file
    const { factureId } = req.body;  // factureId comes from the request body

    // Ensure that a file and factureId are provided
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    if (!factureId) {
      return res.status(400).json({ error: 'Invalid factureId: It should be a valid number' });
    }

    // Ensure factureId is a string and handle special characters in the file name
    const uniqueFileName = encodeURIComponent(file.originalname);  // Encode special characters in the original filename
    const factureIdStr = String(factureId);

    // Define the file path: 'facture-pdf/{factureId}/{originalFileName}'
    const filePath = `facture-pdf/${factureIdStr}/${uniqueFileName}`;

    console.log("Uploading file to path:", filePath);

    // Upload the file to Supabase storage
    const uploadResult = await factureStorage.uploadPdf(file, filePath);

    if (uploadResult.success) {
      return res.status(200).json({
        message: 'File uploaded successfully',
        filePath: uploadResult.filePath,
      });
    } else {
      return res.status(500).json({ error: 'File upload failed' });
    }
  } catch (error) {
    console.error('Error in uploadFileController:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to generate signed URL for a file
const generateSignedUrlController = async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: "File path is required" });
    }

    const signedUrl = await factureStorage.generateSignedUrl(filePath);

    if (!signedUrl) {
      return res.status(500).json({ error: "Failed to generate signed URL" });
    }

    return res.status(200).json({ signedUrl });
  } catch (error) {
    console.error("Error in generateSignedUrlController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
// Controller to download a file
const downloadFileController = async (req, res) => {
  try {
    const { filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ error: "File path is required" });
    }
    console.log("Received file path:", filePath);

    // Ensure the file path is encoded correctly
    const fixedFilePath = filePath.startsWith('facture-pdf/') ? filePath : `facture-pdf/${filePath}`;

    const fileBlob = await factureStorage.downloadPdf(fixedFilePath);

    if (!fileBlob) {
      return res.status(404).json({ error: "File not found" });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${filePath.split('/').pop()}"`);
    res.setHeader("Content-Type", "application/pdf");
    return res.status(200).send(fileBlob);
  } catch (error) {
    console.error("Error in downloadFileController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getFilesByFactureController = async (req, res) => {
  const { factureId } = req.body;
  if (!factureId) {
    return res.status(400).json({ error: "facture ID  is required" });
  }
  try {
    const files = await factureStorage.listFiles(factureId);
    return res.status(200).json({ files });
  } catch (error) {
    console.error("Error fetching files:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const deleteFileController = async (req, res) => {
  const { filePath } = req.body; 

  if (!filePath) {
    return res.status(400).json({ error: "File path is required" });
  }

  try {
    const result = await factureStorage.deleteFile(filePath); 

    if (result.success) {
      return res.status(200).json({ message: "File deleted successfully" });
    } else {
      return res.status(500).json({ error: result.error || "Failed to delete file" });
    }
  } catch (error) {
    console.error("Error in deleteFileController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const factureStorageCntrl = {
  uploadFileController,
  downloadFileController,
  generateSignedUrlController,
  getFilesByFactureController,
  deleteFileController,
};
export default factureStorageCntrl;