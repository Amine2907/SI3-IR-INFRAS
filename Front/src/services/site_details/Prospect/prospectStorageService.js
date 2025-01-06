import axios from 'axios';

const API_URL = 'http://localhost:5000/api/pros-storage';

// Upload a prospect file to the server
const uploadProspectFile = async (file, prospectId) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prospectId', prospectId);
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
const getProspectFiles = async prospectId => {
  try {
    const response = await axios.post(`${API_URL}/get-prospect-files`, { prospectId });
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
      params: { filePath }, // Send filePath as a query parameter
      responseType: 'blob', // Ensure the response is treated as binary
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error downloading file:', error);
    return { success: false, error: error.response?.data || 'Unknown error' };
  }
};

// Delete a prospect file
const deleteProspectFile = async fileId => {
  try {
    const response = await axios.post(`${API_URL}/delete-prospect-file`, { fileId });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.message,
    };
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
