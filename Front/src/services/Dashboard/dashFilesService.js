import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dash-files';

// Fetch DR data
const getDrData = async () => {
  try {
    const response = await axios.get(`${API_URL}/dr-data`);
    return response.data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};
// Download DR data as Excel file
const downloadExcel = async type => {
  try {
    if (!type) {
      console.error('Type is missing or undefined');
      return;
    }
    const response = await axios({
      url: `${API_URL}/download-excel/${type}`,
      method: 'GET',
      responseType: 'blob',
    });
    // Create a Blob from the response data
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    // Create a link to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${type}_data.xlsx`; // The downloaded file will have the type in the filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading the Excel file', error);
  }
};
const dashFilesService = {
  getDrData,
  downloadExcel,
};
export default dashFilesService;
