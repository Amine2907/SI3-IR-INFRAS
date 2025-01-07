import prospectStorage from "../../../storage/prospect/prospectStorage.js";
// Controller to handle file uploads
const uploadFileController = async (req, res) => {
  try {
    const { file } = req; // Access the uploaded file using req.file (not req.body)
    const { prospectId } = req.body; // Prospect ID will still come from the body

    // Check if the prospectId is a valid number
    if (!prospectId || isNaN(prospectId)) {
      return res.status(400).json({ error: 'Invalid prospectId: It should be a valid number' });
    }

    // Generate a unique file name using the current timestamp
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${file.originalname}`;
    
    const prospectIdStr = String(prospectId);
    const filePath = `${prospectIdStr}/${uniqueFileName}`;

    // Call the upload function with the correct file path
    const uploadResult = await prospectStorage.uploadPdf(file, filePath);

    // Check if the upload was successful
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

    const signedUrl = await prospectStorage.generateSignedUrl(filePath);

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
    
    console.log("Received file path:", filePath);  // Log the full file path to confirm it's correct

    const fileBlob = await prospectStorage.downloadPdf(filePath);
    
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

const getFilesByProspectController = async (req, res) => {
  const { prospectId } = req.body;
  if (!prospectId) {
    return res.status(400).json({ error: "Prospect ID is required" });
  }
  try {
    const files = await prospectStorage.listFiles(prospectId);
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
    const result = await prospectStorage.deleteFile(filePath); // Call the delete function

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

const prospectStorageCntrl = {
  uploadFileController,
  downloadFileController,
  generateSignedUrlController,
  getFilesByProspectController,
  deleteFileController,
};
export default prospectStorageCntrl;