import axios from 'axios';
const API_URL = 'http://localhost:5000/api/paie-storage';

// Upload paie File (Store a file in Supabase)
const uploadPaiement = async file => {
  try {
    // Create a new FormData object
    const formData = new FormData();
    // Append the file to the FormData object
    formData.append('file', file);
    // Send the form data as a POST request
    const response = await axios.post(`${API_URL}/upload-paie`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.paiesage };
  }
};
// Generate Signed URL for paie File (Get a URL for secure access)
const generatePaieSignedUrl = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/generate-paie-files`, { params: { filePath } });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.paiesage };
  }
};

// Get Public URL for paie File (For publicly accessible files)
const getPaiePublicUrl = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/get-paie-files`, { params: { filePath } });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.paiesage };
  }
};

// Download paie File (Download a file from Supabase)
const downloadPaie = async filePath => {
  try {
    const response = await axios.post(
      `${API_URL}/download-paie`,
      { filePath },
      { responseType: 'blob' }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.paiesage };
  }
};
const paieStorageService = {
  uploadPaiement,
  generatePaieSignedUrl,
  getPaiePublicUrl,
  downloadPaie,
};
export default paieStorageService;
