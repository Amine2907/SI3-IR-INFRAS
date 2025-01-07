import demRacStorage from "../../../storage/demRacc/drStorage.js";
// Controller to handle file uploads
const uploadFileController = async (req, res) => {
  try {
    const { file } = req;  // Access the uploaded file using req.file (not req.body)
    const { demRacId } = req.body;  // Demrac ID  comes from the request body

    // Ensure that a file and demRacId are provided
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!demRacId || isNaN(demRacId)) {
      return res.status(400).json({ error: 'Invalid demRacId: It should be a valid number' });
    }

    // Use the file name as the unique file name
    const uniqueFileName = file.originalname;  // Use the original file name
    const demRacIdStr = String(demRacId);

    // Define the file path: 'demrac-pdf/{demRacId}/{originalFileName}'
    const filePath = `demrac-pdf/${demRacIdStr}/${uniqueFileName}`;

    console.log("Uploading file to path:", filePath);

    // Upload the file to Supabase storage
    const uploadResult = await demRacStorage.uploadPdf(file, filePath);

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

    const signedUrl = await demRacStorage.generateSignedUrl(filePath);

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

    const fileBlob = await demRacStorage.downloadPdf(filePath);
    
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

const getFilesByDemRacController = async (req, res) => {
  const { demRacId } = req.body;
  if (!demRacId) {
    return res.status(400).json({ error: "Demrac ID  is required" });
  }
  try {
    const files = await demRacStorage.listFiles(demRacId);
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
    const result = await demRacStorage.deleteFile(filePath); 

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
const demRacStorageCntrl = {
  uploadFileController,
  downloadFileController,
  generateSignedUrlController,
  getFilesByDemRacController,
  deleteFileController,
};
export default demRacStorageCntrl;