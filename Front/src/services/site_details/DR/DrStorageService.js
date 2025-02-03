import axios from 'axios';
import config from '../../../config.js';
const API_URL = config.DEMRAC_STORAGE_URL;
// Upload a demracs file to the server
const uploadDemracsFile = async (file, demRacId, Sid) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('demRacId', demRacId);
    formData.append('Sid', Sid);

    const response = await axios.post(`${API_URL}/upload-demracs`, formData, {
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
// Get public URLs for all files associated with a demracs
const getDemracsFiles = async (demRacId, Sid) => {
  try {
    const response = await axios.post(`${API_URL}/get-demracs-files`, { demRacId, Sid });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.message,
    };
  }
};
// Generate a signed URL for secure file access
const generateDemracsSignedUrl = async filePath => {
  try {
    const response = await axios.post(`${API_URL}/generate-demracs-files`, { filePath });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.message,
    };
  }
};
// Download a demracs file
const downlaodDemracsFile = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/download-demracs`, {
      params: { filePath },
      responseType: 'blob',
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error downloading file:', error);
    return { success: false, error: error.response?.data || 'Unknown error' };
  }
};
// Delete a demracs file
const deleteDemracsFile = async filePath => {
  try {
    console.log('Attempting to delete file with path:', filePath);

    // Correct way to send file path in the request body
    const response = await axios.post(`${API_URL}/delete-demracs-file`, { filePath });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.response?.data.error || error.message };
  }
};
// demracs Storage Service: Exports all methods
const demracsStorageService = {
  uploadDemracsFile,
  getDemracsFiles,
  generateDemracsSignedUrl,
  downlaodDemracsFile,
  deleteDemracsFile,
};
export default demracsStorageService;
