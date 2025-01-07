import axios from 'axios';

const API_URL = 'http://localhost:5000/api/devis-storage';

// Upload a devis file to the server
const uploadDevisFile = async (file, devisId) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('devisId', devisId);

    const response = await axios.post(`${API_URL}/upload-devis`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.message,
    };
  }
};
// Get public URLs for all files associated with a devis
const getDevisFiles = async devisId => {
  try {
    const response = await axios.post(`${API_URL}/get-devis-files`, { devisId });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.message,
    };
  }
};
// Generate a signed URL for secure file access
const generateDevisSignedUrl = async filePath => {
  try {
    const response = await axios.post(`${API_URL}/generate-devis-files`, { filePath });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.message,
    };
  }
};
// Download a devis file
const downlaodDevisFile = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/download-devis`, {
      params: { filePath },
      responseType: 'blob',
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error downloading file:', error);
    return { success: false, error: error.response?.data || 'Unknown error' };
  }
};

// Delete a devis file
const deleteDevisFile = async filePath => {
  try {
    console.log('Attempting to delete file with path:', filePath);

    // Correct way to send file path in the request body
    const response = await axios.post(`${API_URL}/delete-devis-file`, { filePath });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.response?.data.error || error.message };
  }
};
// devis Storage Service: Exports all methods
const devisStorageService = {
  uploadDevisFile,
  getDevisFiles,
  generateDevisSignedUrl,
  downlaodDevisFile,
  deleteDevisFile,
};
export default devisStorageService;
