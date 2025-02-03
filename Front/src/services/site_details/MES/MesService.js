import axios from 'axios';
import config from '../../../config.js';
const API_URL = config.MES_URL;
// Create mes Service
const createMes = async ({ Sid, mesData }) => {
  try {
    console.log('sending request:', { Sid, mesData });
    const response = await axios.post(`${API_URL}/create-mes-site`, {
      Sid,
      mesData,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Update mes Service
const updateMes = async (Mid, updates) => {
  console.log('Updates being sent:', updates);
  try {
    const response = await axios.put(`${API_URL}/${Mid}`, updates);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// get meseaux by ID Service
const getMesById = async Mid => {
  try {
    const response = await axios.get(`${API_URL}/${Mid}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all meseaux for a site Service
const getMesSite = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/mes`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Display a mes for a site Service
const displayMesSite = async (Sid, Mid) => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/mes`, {
      data: { Mid },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getActiveMes = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-mes`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getInactiveMes = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-mes`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const siteMesService = {
  createMes,
  updateMes,
  getMesSite,
  displayMesSite,
  getMesById,
  getActiveMes,
  getInactiveMes,
};
export default siteMesService;
