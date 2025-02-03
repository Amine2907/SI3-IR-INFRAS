import axios from 'axios';
import config from '../../../config.js';
const API_URL = config.DEMRAC_URL;
// Create Prospect Service
const createDemRac = async ({ Sid, demracData }) => {
  try {
    console.log('Sending request:', { Sid, demracData });
    const response = await axios.post(`${API_URL}/create-demrac-site`, {
      Sid,
      demracData,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Update Prospect Service
const updateDemRac = async (NDRid, updates) => {
  console.log('Updates being sent:', updates);
  try {
    const response = await axios.put(`${API_URL}/${NDRid}`, updates);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// get Prospect by ID Service
const getDemrabById = async NDRid => {
  try {
    const response = await axios.get(`${API_URL}/${NDRid}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all demracr for a site Service
const getDemRacSite = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/demracs`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Display a Prospect for a site Service
const displayDemRacSite = async (Sid, NDRid) => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/demracs`, {
      data: { NDRid },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all active prospects's site for a dem rac  Service
const getActiveProspectsForDemrac = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-prospects`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all active devis's site for a dem rac  Service
const getActiveDevisForDemrac = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-devis`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getActiveDemracForSite = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-demracs`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getInactiveDemracForSite = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/inactive-demracs`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const SiteDemracService = {
  createDemRac,
  updateDemRac,
  getDemRacSite,
  displayDemRacSite,
  getDemrabById,
  getActiveProspectsForDemrac,
  getActiveDevisForDemrac,
  getActiveDemracForSite,
  getInactiveDemracForSite,
};
export default SiteDemracService;
