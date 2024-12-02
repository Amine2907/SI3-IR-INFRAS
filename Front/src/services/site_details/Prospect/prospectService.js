import axios from 'axios';
const API_URL = 'http://localhost:5000/api/prospect';
// Create Prospect Service
const createProspect = async ({ Sid, prospectData }) => {
  try {
    console.log('Sending request:', { Sid, prospectData });
    const response = await axios.post(`${API_URL}/create-prospect-site`, {
      Sid,
      prospectData,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Update Prospect Service
const updateProspect = async (Proid, updates) => {
  try {
    const response = await axios.put(`${API_URL}/${Proid}`, updates);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// get Prospect by ID Service
const getProspectById = async Proid => {
  try {
    const response = await axios.get(`${API_URL}/${Proid}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Delete Prospect for a site Service
const deleteProspectSite = async (Sid, Proid) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-prospect-site`, {
      data: { Sid, Proid },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all prospects for a site Service
const getProspectsSite = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/prospects`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Display a Prospect for a site Service
const displayProspectsSite = async (Sid, Proid) => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/prospect`, {
      data: { Proid },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all prospects for a site Service
const getAllProspectsForSite = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/prospects`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getActiveProspectsForSite = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-prospects`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getInactiveProspectsForSite = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/inactive-prospects`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const SiteProspectService = {
  createProspect,
  updateProspect,
  deleteProspectSite,
  getProspectsSite,
  displayProspectsSite,
  getProspectById,
  getAllProspectsForSite,
  getActiveProspectsForSite,
  getInactiveProspectsForSite,
};
export default SiteProspectService;
