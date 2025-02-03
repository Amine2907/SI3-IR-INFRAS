import axios from 'axios';
import config from '../../config.js';
const API_URL = config.SITE_FIELDS_URL;
const getPropsectRetenu = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/prospect-retenu`);
    console.log('getPropsectRetenu response:', response.data);
    return { retenu: true };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { retenu: false };
    }
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getDrDate = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/dr-date`);
    return { drDate: response.data || 'N/A' };
  } catch (error) {
    return { drDate: 'N/A' };
  }
};
const getDevisDate = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/devis-date`);
    console.log('getDevisDate response:', response.data);
    return { devisDate: response.data || 'N/A' };
  } catch (error) {
    console.error('Error in getDevisDate:', error.message);
    return { devisDate: 'N/A' };
  }
};

const getReglementDate = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/reglement-date`);
    console.log('getReglementDate response:', response.data);
    return { reglementDate: response.data || 'N/A' };
  } catch (error) {
    console.error('Error in getReglementDate:', error.message);
    return { reglementDate: 'N/A' };
  }
};

const getMesDate = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/mes-date`);
    console.log('getMesDate response:', response.data);
    return { mesDate: response.data.MES_reel || 'N/A' };
  } catch (error) {
    console.error('Error in getMesDate:', error.message);
    return { mesDate: 'N/A' };
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
