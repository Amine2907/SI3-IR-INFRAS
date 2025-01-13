import axios from 'axios';

const API_URL = 'http://localhost:5000/api/trav-storage';

// Upload a trav file to the server
const uploadTravFile = async (file, travId) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('travId', travId);

    const response = await axios.post(`${API_URL}/upload-trav`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.travsage,
    };
  }
};
// Get public URLs for all files associated with a trav
const getTavFiles = async travId => {
  try {
    const response = await axios.post(`${API_URL}/get-trav-files`, { travId });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.travsage,
    };
  }
};
// Generate a signed URL for secure file access
const generateTravSignedUrl = async filePath => {
  try {
    const response = await axios.post(`${API_URL}/generate-trav-files`, { filePath });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.travsage,
    };
  }
};
// Download a trav file
const downloadTravFile = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/download-trav`, {
      params: { filePath },
      responseType: 'blob',
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error downloading file:', error);
    return { success: false, error: error.response?.data || 'Unknown error' };
  }
};

// Delete a trav file
const deleteTravFile = async filePath => {
  try {
    console.log('Attempting to delete file with path:', filePath);

    // Correct way to send file path in the request body
    const response = await axios.post(`${API_URL}/delete-trav-file`, { filePath });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.response?.data.error || error.travsage };
  }
};
// trav Storage Service: Exports all methods
const travStorageService = {
  uploadTravFile,
  getTavFiles,
  generateTravSignedUrl,
  downloadTravFile,
  deleteTravFile,
};
export default travStorageService;
