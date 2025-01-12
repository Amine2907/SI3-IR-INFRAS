import axios from 'axios';
const API_URL = 'http://localhost:5000/api/devis-storage';

// Upload devis File (Store a file in Supabase)
const uploadDevis = async file => {
  try {
    // Create a new FormData object
    const formData = new FormData();
    // Append the file to the FormData object
    formData.append('file', file);
    // Send the form data as a POST request
    const response = await axios.post(`${API_URL}/upload-devis`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Generate Signed URL for devis File (Get a URL for secure access)
const generateDevisSignedUrl = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/generate-devis-files`, { params: { filePath } });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Get Public URL for devis File (For publicly accessible files)
const getDevisPublicUrl = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/get-devis-files`, { params: { filePath } });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Download devis File (Download a file from Supabase)
const downloadDevis = async filePath => {
  try {
    const response = await axios.post(
      `${API_URL}/download-devis`,
      { filePath },
      { responseType: 'blob' }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const devisStorageService = {
  uploadDevis,
  generateDevisSignedUrl,
  getDevisPublicUrl,
  downloadDevis,
};
export default devisStorageService;
