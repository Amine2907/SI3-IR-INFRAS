import { supabase } from "../../config/supabaseClient.js";
const generateSignedUrl = async (filePath) => {
    const { data, error } = await supabase.storage
      .from('demrac-pdf')
      .createSignedUrl(filePath, 60); // URL expires in 60 seconds
  
    if (error) {
      console.error('Error generating signed URL:', error);
      return null;
    }
    return data.signedUrl;
  };
const uploadPdf = async (file) => {
    const filePath = `pdfs/${file.name}`; // Customize the folder structure as needed
  
    const { data, error } = await supabase.storage
      .from('demrac-pdf') // Replace with your bucket name
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false, // Set to true if you want to overwrite files
      });
  
    if (error) {
      console.error('Error uploading file:', error);
      return { success: false, error };
    }
  
    console.log('File uploaded successfully:', data);
    return { success: true, filePath: data.path };
  };
  const getPublicUrl = (filePath) => {
    const { data, error } = supabase.storage
      .from('demrac-pdf') // Replace with your bucket name
      .getPublicUrl(filePath);
  
    if (error) {
      console.error('Error getting public URL:', error);
      return null;
    }
  
    return data.publicUrl;
  };
  const downloadPdf = async (filePath) => {
    const { data, error } = await supabase.storage
      .from('demrac-pdf') // Replace with your bucket name
      .download(filePath);
  
    if (error) {
      console.error('Error downloading file:', error);
      return null;
    }
  
    return data; // This is a Blob representing the file
  };
  const demRacStorage = {
    generateSignedUrl,
    uploadPdf,
    getPublicUrl,
    downloadPdf,
  }
export default demRacStorage ; 