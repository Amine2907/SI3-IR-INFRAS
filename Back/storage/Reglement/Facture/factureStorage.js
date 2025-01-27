import { supabase } from "../../../config/supabaseClient.js";
const generateSignedUrl = async (filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from("facture-pdf") 
      .createSignedUrl(filePath, 60); // URL expires in 60 seconds

    if (error) throw error;

    return data.signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
};
const uploadPdf = async (file, filePath) => {
  try {
    // Ensure file path is encoded to prevent issues with special characters
    const encodedFilePath = encodeURIComponent(filePath);

    console.log("Uploading file to path:", encodedFilePath);

    // Perform file upload using Supabase storage
    const { data, error } = await supabase.storage
      .from("facture-pdf")
      .upload(encodedFilePath, file.buffer, {
        cacheControl: "3600",
        contentType: file.mimetype,  // Use the mimetype provided by the file
        upsert: true,  // Ensure that the file will overwrite the existing one
      });

    if (error) throw error;

    return { success: true, filePath: data.path };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: error.message || error };
  }
};

const getPublicUrl = (filePath) => {
  try {
    const { data, error } = supabase.storage
      .from("facture-pdf") 
      .getPublicUrl(filePath);

    if (error) throw error;

    return data.publicUrl;
  } catch (error) {
    console.error("Error getting public URL:", error);
    return null;
  }
};

const downloadPdf = async (filePath) => {
  try {
    console.log("Attempting to download file from path:", filePath);
    // Ensure that the file path has only one 'facture-pdf/' prefix
    const fixedFilePath = filePath.startsWith('facture-pdf/') ? filePath : `facture-pdf/${filePath}`;
    console.log(fixedFilePath);

    const { data, error } = await supabase.storage
      .from("facture-pdf")
      .download(fixedFilePath);

    if (error) {
      console.error("Error downloading file:", error);
      throw new Error(error.message || "Error downloading file");
    }
    return data;
  } catch (error) {
    console.error("Error in downloadPdf:", error);
    return null;
  }
};

const deleteFile = async (filePath) => {
  try {
    console.log("Attempting to deleting file from path:", filePath);
    // Delete the file from Supabase storage
    const { data, error } = await supabase.storage
      .from("facture-pdf")
      .remove(filePath); 
    if (error) {
      throw error;
    }
    // If file is deleted, return a success response
    return { success: true, data: data };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, error: error.message || error };
  }
};

const listFiles = async (factureId,Sid) => {
  try {
    // Ensure factureId is a string when constructing the path
    const folderPath = `facture-pdf/${Sid}/${factureId}`;
    console.log(`Fetching files from folder: ${folderPath}`);

    // Use the Supabase client to list files
    const { data, error } = await supabase.storage
      .from("facture-pdf")
      .list(folderPath);

    if (error) {
      console.error("Error fetching files from Supabase:", error);
      return [];
    }
    console.log("Fetched files:", data); // Log the fetched files
    // Map through the files to return the proper structure
    return data.map(file => ({
      name: file.name,
      path: `facture-pdf/${Sid}/${factureId}/${file.name}`,
    }));
  } catch (error) {
    console.error("Error listing files:", error);
    return [];
  }
};
const factureStorage = {
  generateSignedUrl,
  uploadPdf,
  getPublicUrl,
  downloadPdf,
  listFiles,
  deleteFile,
};
export default factureStorage;
