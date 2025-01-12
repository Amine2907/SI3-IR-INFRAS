import axios from 'axios';
const API_URL = 'http://localhost:5000/api/dp-storage';

// Upload Dp File (Store a file in Supabase)
const uploadDp = async file => {
  try {
    // Create a new FormData object
    const formData = new FormData();
    // Append the file to the FormData object
    formData.append('file', file);
    // Send the form data as a POST request
    const response = await axios.post(`${API_URL}/upload-dp`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Generate Signed URL for Dp File (Get a URL for secure access)
const generateDpSignedUrl = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/generate-dp-files`, { params: { filePath } });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Get Public URL for Dp File (For publicly accessible files)
const getDpPublicUrl = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/get-dp-files`, { params: { filePath } });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Download Dp File (Download a file from Supabase)
const downloadDp = async filePath => {
  try {
    const response = await axios.post(
      `${API_URL}/download-dp`,
      { filePath },
      { responseType: 'blob' }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const DpStorageService = {
  uploadDp,
  generateDpSignedUrl,
  getDpPublicUrl,
  downloadDp,
};
export default DpStorageService;
