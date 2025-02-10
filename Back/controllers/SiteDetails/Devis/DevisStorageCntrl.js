import devisStorage from "../../../storage/Devis/devisStorage.js";
// Controller to handle file uploads
const uploadFileController = async (req, res) => {
  try {
    const { file } = req;
    const { devisId,Sid  } = req.body;
    // Ensure that a file and devisId are provided
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    if (!devisId) {
      return res.status(400).json({ error: 'Invalid devisId' });
    }
    if (!Sid) {
      return res.status(400).json({ error: 'Invalid Sid' });
    }
    // Use the file name as the unique file name and sanitize it
    const sanitizeFileName = (name) => {
      return name.replace(/[^a-zA-Z0-9._-]/g, '_'); // Replace invalid characters with "_"
    };
    // Use the file name as the unique file name
    const uniqueFileName = sanitizeFileName(file.originalname);
    const devisIdStr = String(devisId);
    const sidStr = String(Sid);
    const filePath = `devis-pdf/${sidStr}/${devisIdStr}/${uniqueFileName}`;

    console.log("Uploading file to path:", filePath);

    // Upload the file to Supabase storage
    const uploadResult = await devisStorage.uploadPdf(file, filePath);

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

    const signedUrl = await devisStorage.generateSignedUrl(filePath);

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

    const fileBlob = await devisStorage.downloadPdf(filePath);
    
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

const getFilesByDevisController = async (req, res) => {
  const { devisId,Sid  } = req.body;
  if (!devisId) {
    return res.status(400).json({ error: "Devis ID  is required" });
  }
  if (!Sid) {
    return res.status(400).json({ error: "Sid ID  is required" });
  }
  try {
    const files = await devisStorage.listFiles(devisId,Sid);
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
    const result = await devisStorage.deleteFile(filePath); 

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
const devisStorageCntrl = {
  uploadFileController,
  downloadFileController,
  generateSignedUrlController,
  getFilesByDevisController,
  deleteFileController,
};
export default devisStorageCntrl;