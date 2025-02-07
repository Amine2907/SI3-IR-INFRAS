import axios from 'axios';
const API_URL = 'https://si3-ir-infras.onrender.com/api/facture';
// Create Facture Service
const createFacture = async ({ Sid, factureData }) => {
  try {
    console.log('sending request:', { Sid, factureData });
    const response = await axios.post(`${API_URL}/create-facture-site`, {
      Sid,
      factureData,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.Facturesage,
    };
  }
};
// Update Facture Service
const updateFacture = async (Fid, updates) => {
  console.log('Updates being sent:', updates);
  try {
    const response = await axios.put(`${API_URL}/${Fid}`, updates);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.Facturesage,
    };
  }
};
// get Factureeaux by ID Service
const getFactureById = async Fid => {
  try {
    const response = await axios.get(`${API_URL}/${Fid}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.Facturesage,
    };
  }
};
// Get all Factureeaux for a site Service
const getFactureSite = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/facture`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.Facturesage,
    };
  }
};
// Display a Facture for a site Service
const displayFactureSite = async (Sid, Fid) => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/facture`, {
      data: { Fid },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.Facturesage,
    };
  }
};
const getActiveFacture = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-facture`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.Facturesage,
    };
  }
};
const getInactiveFacture = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-facture`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : error.Facturesage,
    };
  }
};
const siteFactureService = {
  createFacture,
  updateFacture,
  getFactureSite,
  displayFactureSite,
  getFactureById,
  getActiveFacture,
  getInactiveFacture,
};
export default siteFactureService;
