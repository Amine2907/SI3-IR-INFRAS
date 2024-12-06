import axios from 'axios';

const API_URL = 'http://localhost:5000/api/pros-storage';

// Upload Prospect File (Store a file in Supabase)
const uploadProspectFile = async file => {
  try {
    // Create a new FormData object
    const formData = new FormData();
    // Append the file to the FormData object
    formData.append('file', file); // 'file' is the key that your backend expects
    // Send the form data as a POST request
    const response = await axios.post(`${API_URL}/upload-prospect`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Let axios handle this for file upload
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Generate Signed URL for Prospect File (Get a URL for secure access)
const generateProspectSignedUrl = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/generate-prospect-files`, {
      params: { filePath },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Get Public URL for Prospect File (For publicly accessible files)
const getProspectPublicUrl = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/get-prospect-files`, { params: { filePath } });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Download Prospect File (Download a file from Supabase)
const downloadProspectFile = async filePath => {
  try {
    const response = await axios.post(
      `${API_URL}/download-prospect`,
      { filePath },
      { responseType: 'blob' }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

const ProspectStorageService = {
  uploadProspectFile,
  generateProspectSignedUrl,
  getProspectPublicUrl,
  downloadProspectFile,
};

export default ProspectStorageService;
