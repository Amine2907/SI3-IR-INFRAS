import axios from 'axios';
const API_URL = 'http://localhost:5000/api/fac-storage';

// Upload fac File (Store a file in Supabase)
const uploadFactureFile = async (file, factureId) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('factureId', factureId);

    const response = await axios.post(`${API_URL}/upload-facture`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.Facturesage,
    };
  }
};
// Get public URLs for all files associated with a Facture
const getFactureFiles = async factureId => {
  try {
    const response = await axios.post(`${API_URL}/get-facture-files`, { factureId });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.Facturesage,
    };
  }
};
// Generate a signed URL for secure file access
const generateFactureSignedUrl = async filePath => {
  try {
    const response = await axios.post(`${API_URL}/generate-facture-files`, { filePath });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.Facturesage,
    };
  }
};
// Download a Facture file
const downloadFactureFile = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/download-facture`, {
      params: { filePath },
      responseType: 'blob',
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error downloading file:', error);
    return { success: false, error: error.response?.data || 'Unknown error' };
  }
};

// Delete a Facture file
const deleteFactureFile = async filePath => {
  try {
    console.log('Attempting to delete file with path:', filePath);

    // Correct way to send file path in the request body
    const response = await axios.post(`${API_URL}/delete-facture-file`, { filePath });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.response?.data.error || error.Facturesage };
  }
};
const facStorageService = {
uploadFactureFile,
getFactureFiles,
generateFactureSignedUrl,
deleteFactureFile,
downloadFactureFile,
};
export default facStorageService;
