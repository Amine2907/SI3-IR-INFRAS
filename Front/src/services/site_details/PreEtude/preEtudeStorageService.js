import axios from 'axios';

const API_URL = 'https://si3-ir-infras.onrender.com/api/pre-storage';

// Upload a preEtude file to the server
const uploadPreEtudeFile = async (file, preEtudeId) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('preEtudeId', preEtudeId);

    const response = await axios.post(`${API_URL}/upload-preEtude`, formData, {
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
// Get public URLs for all files associated with a preEtude
const getPreEtudeFiles = async preEtudeId => {
  try {
    const response = await axios.post(`${API_URL}/get-preEtude-files`, { preEtudeId });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.message,
    };
  }
};
// Generate a signed URL for secure file access
const generatePreEtudeSignedUrl = async filePath => {
  try {
    const response = await axios.post(`${API_URL}/generate-preEtude-files`, { filePath });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.message,
    };
  }
};
// Download a preEtude file
const downlaodPreEtudeFile = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/download-preEtude`, {
      params: { filePath },
      responseType: 'blob',
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error downloading file:', error);
    return { success: false, error: error.response?.data || 'Unknown error' };
  }
};

// Delete a preEtude file
const deletePreEtudeFile = async filePath => {
  try {
    console.log('Attempting to delete file with path:', filePath);

    // Correct way to send file path in the request body
    const response = await axios.post(`${API_URL}/delete-preEtude-file`, { filePath });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.response?.data.error || error.message };
  }
};

// preEtude Storage Service: Exports all methods
const preEtudeStorageService = {
  uploadPreEtudeFile,
  getPreEtudeFiles,
  generatePreEtudeSignedUrl,
  downlaodPreEtudeFile,
  deletePreEtudeFile,
};
export default preEtudeStorageService;
