import axios from 'axios';
const API_URL = 'http://localhost:5000/api/mes-storage';

// Upload mes File (Store a file in Supabase)
const uploadMes = async file => {
  try {
    // Create a new FormData object
    const formData = new FormData();
    // Append the file to the FormData object
    formData.append('file', file);
    // Send the form data as a POST request
    const response = await axios.post(`${API_URL}/upload-mes`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Generate Signed URL for mes File (Get a URL for secure access)
const generateMesSignedUrl = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/generate-mes-files`, { params: { filePath } });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Get Public URL for mes File (For publicly accessible files)
const getMesPublicUrl = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/get-mes-files`, { params: { filePath } });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Download mes File (Download a file from Supabase)
const downloadMes = async filePath => {
  try {
    const response = await axios.post(
      `${API_URL}/download-mes`,
      { filePath },
      { responseType: 'blob' }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const mesStorageService = {
  uploadMes,
  generateMesSignedUrl,
  getMesPublicUrl,
  downloadMes,
};
export default mesStorageService;
