import axios from 'axios';

const API_URL = `${process.env.BACKEND_URL}/api/dp-storage`;

// Upload a dp file to the server
const uploadDpFile = async (file, declPreaId) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('declPreaId', declPreaId);

    const response = await axios.post(`${API_URL}/upload-dp`, formData, {
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
// Get public URLs for all files associated with a dp
const getDpFiles = async declPreaId => {
  try {
    const response = await axios.post(`${API_URL}/get-dp-files`, { declPreaId });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.message,
    };
  }
};
// Generate a signed URL for secure file access
const generatedpSignedUrl = async filePath => {
  try {
    const response = await axios.post(`${API_URL}/generate-dp-files`, { filePath });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.message,
    };
  }
};
// Download a dp file
const downlaodDpFile = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/download-dp`, {
      params: { filePath },
      responseType: 'blob',
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error downloading file:', error);
    return { success: false, error: error.response?.data || 'Unknown error' };
  }
};

// Delete a dp file
const deleteDpFile = async filePath => {
  try {
    console.log('Attempting to delete file with path:', filePath);

    // Correct way to send file path in the request body
    const response = await axios.post(`${API_URL}/delete-dp-file`, { filePath });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.response?.data.error || error.message };
  }
};

// dp Storage Service: Exports all methods
const DeclPraelStorageService = {
  uploadDpFile,
  getDpFiles,
  generatedpSignedUrl,
  downlaodDpFile,
  deleteDpFile,
};
export default DeclPraelStorageService;
