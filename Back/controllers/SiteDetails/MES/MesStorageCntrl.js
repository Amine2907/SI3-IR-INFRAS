import mesStorage from "../../../storage/MES/mesStorage.js";
// Controller to handle file uploads
 const uploadFileController = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const uploadResult = await mesStorage.uploadPdf(file);

    if (!uploadResult.success) {
      return res.status(500).json({ error: "File upload failed", details: uploadResult.error });
    }

    return res.status(200).json({ message: "File uploaded successfully", path: uploadResult.filePath });
  } catch (error) {
    console.error("Error in uploadFileController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
// Controller to generate signed URL for a file
 const generateSignedUrlController = async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: "File path is required" });
    }

    const signedUrl = await mesStorage.generateSignedUrl(filePath);

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
    const { filePath } = req.params;

    if (!filePath) {
      return res.status(400).json({ error: "File path is required" });
    }

    const fileBlob = await mesStorage.downloadPdf(filePath);

    if (!fileBlob) {
      return res.status(500).json({ error: "Failed to download file" });
    }
    res.setHeader("Content-Disposition", `attachment; filename="${filePath.split('/').pop()}"`);
    res.setHeader("Content-Type", "application/pdf");
    return res.status(200).send(fileBlob);
  } catch (error) {
    console.error("Error in downloadFileController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
// Controller to get public URL for a file
 const getPublicUrlController = async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: "File path is required" });
    }

    const publicUrl = mesStorage.getPublicUrl(filePath);

    if (!publicUrl) {
      return res.status(500).json({ error: "Failed to get public URL" });
    }

    return res.status(200).json({ publicUrl });
  } catch (error) {
    console.error("Error in getPublicUrlController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const mesStorageCntrl = {
    uploadFileController,
    downloadFileController,
    getPublicUrlController,
    generateSignedUrlController,
}
export default mesStorageCntrl;