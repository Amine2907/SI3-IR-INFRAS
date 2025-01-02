import axios from 'axios';
const API_URL = 'http://localhost:5000/api/fac-storage';

// Upload fac File (Store a file in Supabase)
const uploadFacture = async file => {
  try {
    // Create a new FormData object
    const formData = new FormData();
    // Append the file to the FormData object
    formData.append('file', file);
    // Send the form data as a POST request
    const response = await axios.post(`${API_URL}/upload-facture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.facsage };
  }
};
// Generate Signed URL for fac File (Get a URL for secure access)
const generateFacSignedUrl = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/generate-facture-files`, { params: { filePath } });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.facsage };
  }
};

// Get Public URL for fac File (For publicly accessible files)
const gettFacPublicUrl = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/get-facture-files`, { params: { filePath } });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.facsage };
  }
};

// Download fac File (Download a file from Supabase)
const downloadFacture = async filePath => {
  try {
    const response = await axios.post(
      `${API_URL}/download-facture`,
      { filePath },
      { responseType: 'blob' }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.facsage };
  }
};
const facStorageService = {
  uploadFacture,
  generateFacSignedUrl,
  gettFacPublicUrl,
  downloadFacture,
};
export default facStorageService;
