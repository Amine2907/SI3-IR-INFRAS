import axios from 'axios';

const API_URL = 'http://localhost:5000/api/check-files';

const checkAllFilesStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data.fileStatuses;
  } catch (error) {
    console.error('Error checking files for all components:', error.message);
    return {};
  }
};

const checkFilesService = {
  checkAllFilesStatus,
};

export default checkFilesService;
