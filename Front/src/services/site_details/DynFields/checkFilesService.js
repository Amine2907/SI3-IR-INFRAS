import axios from 'axios';

const API_URL = `${process.env.BACKEND_URL}/api/check-files`;

const checkAllFilesStatus = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}`);
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
