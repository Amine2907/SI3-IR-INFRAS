import axios from 'axios';
const API_URL = 'http://localhost:5000/api/trav-storage';

// Upload trav File (Store a file in Supabase)
const uploadTrav = async file => {
  try {
    // Create a new FormData object
    const formData = new FormData();
    // Append the file to the FormData object
    formData.append('file', file);
    // Send the form data as a POST request
    const response = await axios.post(`${API_URL}/upload-trav`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.travsage };
  }
};
// Generate Signed URL for trav File (Get a URL for secure access)
const generateTravSignedUrl = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/generate-trav-files`, { params: { filePath } });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.travsage };
  }
};

// Get Public URL for trav File (For publicly accessible files)
const gettTavPublicUrl = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/get-trav-files`, { params: { filePath } });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.travsage };
  }
};

// Download trav File (Download a file from Supabase)
const downloadTrav = async filePath => {
  try {
    const response = await axios.post(
      `${API_URL}/download-trav`,
      { filePath },
      { responseType: 'blob' }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.travsage };
  }
};
const travStorageService = {
  uploadTrav,
  generateTravSignedUrl,
  gettTavPublicUrl,
  downloadTrav,
};
export default travStorageService;
