import axios from 'axios';
import config from '../../../config.js';
const API_URL = config.PRESOPECT_STORAGE_URL;
// Upload a prospect file to the server
const uploadProspectFile = async (file, prospectId, Sid) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prospectId', prospectId);
    formData.append('Sid', Sid);
    const response = await axios.post(`${API_URL}/upload-prospect`, formData, {
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
// Get public URLs for all files associated with a prospect
const getProspectFiles = async (prospectId, Sid) => {
  try {
    const response = await axios.post(`${API_URL}/get-prospect-files`, { prospectId, Sid });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.message,
    };
  }
};
// Generate a signed URL for secure file access
const generateProspectSignedUrl = async filePath => {
  try {
    const response = await axios.post(`${API_URL}/generate-prospect-files`, { filePath });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.message,
    };
  }
};
// Download a prospect file
const downloadProspectFile = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/download-prospect`, {
      params: { filePath },
      responseType: 'blob',
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error downloading file:', error);
    return { success: false, error: error.response?.data || 'Unknown error' };
  }
};

// Delete a prospect file
const deleteProspectFile = async filePath => {
  try {
    console.log('Attempting to delete file with path:', filePath);

    // Correct way to send file path in the request body
    const response = await axios.post(`${API_URL}/delete-prospect-file`, { filePath });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.response?.data.error || error.message };
  }
};

// Prospect Storage Service: Exports all methods
const ProspectStorageService = {
  uploadProspectFile,
  getProspectFiles,
  generateProspectSignedUrl,
  downloadProspectFile,
  deleteProspectFile,
};
export default ProspectStorageService;
