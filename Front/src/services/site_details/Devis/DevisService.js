import axios from 'axios';
const API_URL = 'http://localhost:5000/api/devis';
// Create Devis Service
const createDevis = async ({ Sid, devisData }) => {
  try {
    console.log('Sending request:', { Sid, devisData });
    const response = await axios.post(`${API_URL}/create-devis-site`, {
      Sid,
      devisData,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Update Devis Service
const updateDevis = async (ND, updates) => {
  console.log('Updates being sent:', updates);
  try {
    const response = await axios.put(`${API_URL}/${ND}`, updates);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// get Devis by ID Service
const getDevisById = async ND => {
  try {
    const response = await axios.get(`${API_URL}/${ND}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all demracr for a site Service
const getDevisSite = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/devis`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Display a Devis for a site Service
const displayDevisSite = async (Sid, ND) => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/devis`, {
      data: { ND },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all active Deviss's site for a dem rac  Service
const getActiveFrnsForDevis = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-fours`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all active devis's site for a dem rac  Service
const getActiveFacturesForDevis = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-factures`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getActivePaieForDevis = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-paies`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getActiveDevis = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-devis`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getinactiveDevis = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-devis`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getFactureDetails = async ND => {
  try {
    const response = await axios.get(`${API_URL}/${ND}/facture-details`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const SiteDevisService = {
  createDevis,
  updateDevis,
  getDevisSite,
  displayDevisSite,
  getDevisById,
  getActiveFrnsForDevis,
  getActiveFacturesForDevis,
  getActivePaieForDevis,
  getActiveDevis,
  getinactiveDevis,
  getFactureDetails,
};
export default SiteDevisService;
