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
        const response = await axios.get(`${API_URL}/download-dr-excel`, {
            responseType: 'arraybuffer',
        });

        // Create a Blob and trigger a download in the browser
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'dr_data.xlsx';
        link.click();
    } catch (error) {
        console.error('Error downloading the Excel file', error);
    }
};
const dashFilesService = {
    getDrData,
    downloadDrExcel,
}
export default dashFilesService ;
