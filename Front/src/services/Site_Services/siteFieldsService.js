import axios from 'axios';
const API_URL = 'http://localhost:5000/api/site-fields';
const getPropsectRetenu = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/prospect-retenu`);
    return response.data;
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getDrDate = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/dr-date`);
    return response.data;
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getDevisDate = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/devis-date`);
    return response.data;
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getReglementDate = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/reglement-date`);
    return response.data;
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getMesDate = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/mes-date`);
    return response.data;
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const SiteFieldsService = {
  getPropsectRetenu,
  getDrDate,
  getDevisDate,
  getReglementDate,
  getMesDate,
};
export default SiteFieldsService;
