import axios from 'axios';

const API_URL = `${process.env.BACKEND_URL}/api/mes-storage`;

// Upload a mes file to the server
const uploadMesFile = async (file, mesId, Sid) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mesId', mesId);
    formData.append('Sid', Sid);

    const response = await axios.post(`${API_URL}/upload-mes`, formData, {
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
// Get public URLs for all files associated with a mes
const getMesFiles = async (mesId, Sid) => {
  try {
    const response = await axios.post(`${API_URL}/get-mes-files`, { mesId, Sid });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.message,
    };
  }
};
// Generate a signed URL for secure file access
const generateMesSignedUrl = async filePath => {
  try {
    const response = await axios.post(`${API_URL}/generate-mes-files`, { filePath });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.message,
    };
  }
};
// Download a mes file
const downloadMesFile = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/download-mes`, {
      params: { filePath },
      responseType: 'blob',
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error downloading file:', error);
    return { success: false, error: error.response?.data || 'Unknown error' };
  }
};

// Delete a mes file
const deleteMesFile = async filePath => {
  try {
    console.log('Attempting to delete file with path:', filePath);

    // Correct way to send file path in the request body
    const response = await axios.post(`${API_URL}/delete-mes-file`, { filePath });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.response?.data.error || error.message };
  }
};
// mes Storage Service: Exports all methods
const mesStorageService = {
  uploadMesFile,
  getMesFiles,
  generateMesSignedUrl,
  downloadMesFile,
  deleteMesFile,
};
export default mesStorageService;
