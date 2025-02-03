import axios from 'axios';
import config from '../../../config.js';
const API_URL = config.CHECK_FILES_URL;
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
