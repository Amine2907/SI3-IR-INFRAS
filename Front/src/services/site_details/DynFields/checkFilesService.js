import axios from 'axios';
const API_URL = 'http://localhost:5000/api/check-files';
const checkFilesForComponent = async (component, componentId) => {
  try {
    const response = await axios.get(`${API_URL}/${component}/${componentId}`);
    return response.data.hasFiles;
  } catch (error) {
    console.error('Error checking files for component:', error.message);
    return false;
  }
};
const checkFilesService = {
  checkFilesForComponent,
};
export default checkFilesService;
