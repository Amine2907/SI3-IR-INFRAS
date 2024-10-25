
import axios from 'axios';
const API_URL = 'http://localhost:5000/api/users';
const getUser = async () => {
    try {
        const response = await axios.get(`${API_URL}`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response ? error.response.data.error : error.message };
    }
};
const getUsersService = {
    getUser,
};

export default getUsersService;