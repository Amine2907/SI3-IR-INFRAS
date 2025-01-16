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
const downloadDrExcel = async () => {
  try {
    const response = await axios({
      url: `${API_URL}/download-dr-excel`,
      method: 'GET',
      responseType: 'blob',
    });

    // Create a link element to trigger download
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'dr_produit.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading the Excel file', error);
  }
};
const dashFilesService = {
  getDrData,
  downloadDrExcel,
};
export default dashFilesService;
