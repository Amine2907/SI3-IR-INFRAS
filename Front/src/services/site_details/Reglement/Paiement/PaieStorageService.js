import axios from 'axios';

const API_URL = 'http://localhost:5000/api/paie-storage';

// Upload a paie file to the server
const uploadPaieFile = async (file, paieId, Sid) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('paieId', paieId);
    formData.append('Sid', Sid);
    const response = await axios.post(`${API_URL}/upload-paie`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.paiesage,
    };
  }
};
// Get public URLs for all files associated with a paie
const getPaieFiles = async (paieId, Sid) => {
  try {
    const response = await axios.post(`${API_URL}/get-paie-files`, { paieId, Sid });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.paiesage,
    };
  }
};
// Generate a signed URL for secure file access
const generatePaieSignedUrl = async filePath => {
  try {
    const response = await axios.post(`${API_URL}/generate-paie-files`, { filePath });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.paiesage,
    };
  }
};
// Download a paie file
const downloadPaieFile = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/download-paie`, {
      params: { filePath },
      responseType: 'blob',
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error downloading file:', error);
    return { success: false, error: error.response?.data || 'Unknown error' };
  }
};

// Delete a paie file
const deletePaieFile = async filePath => {
  try {
    console.log('Attempting to delete file with path:', filePath);

    // Correct way to send file path in the request body
    const response = await axios.post(`${API_URL}/delete-paie-file`, { filePath });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.response?.data.error || error.paiesage };
  }
};
// paie Storage Service: Exports all methods
const paieStorageService = {
  uploadPaieFile,
  getPaieFiles,
  generatePaieSignedUrl,
  downloadPaieFile,
  deletePaieFile,
};
export default paieStorageService;
