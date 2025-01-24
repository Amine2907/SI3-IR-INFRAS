import axios from 'axios';
const API_URL = 'http://localhost:5000/api/reporting-file';
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
const listReports = async () => {
  try {
    const response = await axios.get(`${API_URL}/reports`);
    if (response.data.success) {
      return response.data.reports; // Return the list of reports
    } else {
      console.error('Error fetching reports:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};
const getSignedUrl = async filename => {
  try {
    if (!filename) {
      console.error('Filename is missing or undefined');
      return null;
    }
    const response = await axios.get(`${API_URL}/reports/signed-url/${filename}`);
    if (response.data.success) {
      return response.data.url;
    } else {
      console.error('Error fetching signed URL:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching signed URL:', error);
    return null;
  }
};
const downloadReportFile = async filePath => {
  try {
    const response = await axios.get(`${API_URL}/download-report`, {
      params: { filePath },
      responseType: 'blob',
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error downloading file:', error);
    return { success: false, error: error.response?.data || 'Unknown error' };
  }
};
const reportingFileService = {
  downloadExcel,
  listReports,
  getSignedUrl,
  downloadReportFile,
};
export default reportingFileService;
