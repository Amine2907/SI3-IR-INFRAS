import { supabase } from "../../config/supabaseClient.js";

const generateSignedUrl = async (filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from("prospect-pdf") // Replace with your bucket name
      .createSignedUrl(filePath, 60); // URL expires in 60 seconds

    if (error) throw error;

    return data.signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
};

const uploadPdf = async (file) => {
  try {
    const filePath = `pdfs/${file.originalname}`; // Customize the folder structure as needed

    const { data, error } = await supabase.storage
      .from("prospect-pdf") // Replace with your bucket name
      .upload(filePath, file.buffer, {
        cacheControl: "3600",
        upsert: false, // Set to true if you want to overwrite files
        contentType: file.mimetype, // Important for correct file type
      });

    if (error) throw error;

    return { success: true, filePath: data.path };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error };
  }
};

const getPublicUrl = (filePath) => {
  try {
    const { data, error } = supabase.storage
      .from("prospect-pdf") // Replace with your bucket name
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
    console.log("Attempting to download file from path:", filePath); // Debug log
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
const prospectStorage = {
  generateSignedUrl,
  uploadPdf,
  getPublicUrl,
  downloadPdf,
};

export default prospectStorage;
