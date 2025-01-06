import { supabase } from "../../config/supabaseClient.js";

const generateSignedUrl = async (filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from("prospect-pdf") 
      .createSignedUrl(filePath, 60); // URL expires in 60 seconds

    if (error) throw error;

    return data.signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
};
const uploadPdf = async (file, prospectId) => {
  try {
    // Validate that prospectId is a number
    if (!prospectId) {
      throw new Error('Invalid prospectId: It should be a valid number');
    }
    // Convert prospectId to string for constructing the file path
    const prospectIdStr = String(prospectId);
    const filePath = `${prospectIdStr}/${file.originalname}`;

    // Perform file upload using Supabase storage
    const { data, error } = await supabase.storage
      .from("prospect-pdf")
      .upload(filePath, file.buffer, {
        cacheControl: "3600",
        upsert: false,  // Set to true if you want to overwrite the file
        contentType: file.mimetype,  // Set the content type of the file
      });

    if (error) throw error;

    // Return file path if successful
    return { success: true, filePath: data.path };

  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: error.message || error };
  }
};

const getPublicUrl = (filePath) => {
  try {
    const { data, error } = supabase.storage
      .from("prospect-pdf") 
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
    const encodedFilePath = encodeURIComponent(filePath);
    const { data, error } = await supabase.storage
      .from("prospect-pdf")
      .download(encodedFilePath);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error downloading file:", error);
    return null;
  }
};
const listFiles = async (prospectId) => {
  try {
    // Ensure prospectId is a string when constructing the path
    const folderPath = `prospect-pdf/${prospectId}`;
    console.log(`Fetching files from folder: ${folderPath}`); // Add logging here to debug the path

    // Use the Supabase client to list files
    const { data, error } = await supabase.storage
      .from("prospect-pdf")
      .list(folderPath);

    if (error) {
      console.error("Error fetching files from Supabase:", error);
      return [];
    }
    console.log("Fetched files:", data); // Log the fetched files
    // Map through the files to return the proper structure
    return data.map(file => ({
      name: file.name,
      path: `prospect-pdf/${prospectId}/${file.name}`,
    }));
  } catch (error) {
    console.error("Error listing files:", error);
    return [];
  }
};

const prospectStorage = {
  generateSignedUrl,
  uploadPdf,
  getPublicUrl,
  downloadPdf,
  listFiles,
};

export default prospectStorage;
