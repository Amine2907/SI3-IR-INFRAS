import axios from 'axios';
import config from '../../config.js';
const API_URL = config.DASH_FILES_URL;
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
    link.download = `${type}_data.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading the Excel file', error);
  }
};
const dashFilesService = {
  downloadExcel,
};
export default dashFilesService;
