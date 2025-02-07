import axios from 'axios';
const API_URL = `${process.env.BACKEND_URL}/api/paie`;
// Create paie Service
const createPaie = async ({ Sid, paiementData }) => {
  try {
    console.log('sending request:', { Sid, paiementData });
    const response = await axios.post(`${API_URL}/create-paie-site`, {
      Sid,
      paiementData,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Update paie Service
const updatePaie = async (Pid, updates) => {
  console.log('Updates being sent:', updates);
  try {
    const response = await axios.put(`${API_URL}/${Pid}`, updates);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// get paieeaux by ID Service
const getPaieById = async Pid => {
  try {
    const response = await axios.get(`${API_URL}/${Pid}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all paieeaux for a site Service
const getPaieSite = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/paie`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Display a paie for a site Service
const displayPaieSite = async (Sid, Pid) => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/paies`, {
      data: { Pid },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getActivePaie = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-paie`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getInactivePaie = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-paie`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const sitePaiementService = {
  createPaie,
  updatePaie,
  getPaieSite,
  displayPaieSite,
  getPaieById,
  getActivePaie,
  getInactivePaie,
};
export default sitePaiementService;
