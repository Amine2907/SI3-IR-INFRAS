import axios from 'axios';
const API_URL = 'http://localhost:5000/api/preEtude';
// Create PreEtude Service
const createPreEtude = async ({ Sid, preEtudeData }) => {
  try {
    console.log('Sending request:', { Sid, preEtudeData });
    const response = await axios.post(`${API_URL}/create-preetude-site`, {
      Sid,
      preEtudeData,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Update PreEtude Service
const updatePreEtude = async (PREid, updates) => {
  console.log('Updates being sent:', updates);
  try {
    const response = await axios.put(`${API_URL}/${PREid}`, updates);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// get PreEtude by ID Service
const getPreEtudeById = async PREid => {
  try {
    const response = await axios.get(`${API_URL}/${PREid}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all PreEtudes for a site Service
const getPreEtudesSite = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/preetude`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Display a PreEtude for a site Service
const displayPreEtudesSite = async (Sid, PREid) => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/preetude`, {
      data: { PREid },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all PreEtudes for a site Service
const getAllPreEtudesForSite = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/preetude`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getActivePreEtudesForSite = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-preetudes`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getInactivePreEtudesForSite = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/inactive-preetudes`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const SitePreEtudeService = {
  createPreEtude,
  updatePreEtude,
  getPreEtudesSite,
  displayPreEtudesSite,
  getPreEtudeById,
  getAllPreEtudesForSite,
  getActivePreEtudesForSite,
  getInactivePreEtudesForSite,
};
export default SitePreEtudeService;
