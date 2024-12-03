import axios from 'axios';
const API_URL = 'http://localhost:5000/api/dps';
// Create Dp Service
const createDp = async ({ Proid, dpData }) => {
  try {
    const response = await axios.post(`${API_URL}/create-dp-prospect`, {
      Proid,
      dpData,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Update Dp Service
const updateDp = async (DPid, updates) => {
  try {
    const response = await axios.put(`${API_URL}/${DPid}`, updates);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// get Dp by ID Service
const getDpById = async DPid => {
  try {
    const response = await axios.get(`${API_URL}/${DPid}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Delete Dp for a Prospect Service
// need to implement the backend logic to delete the Dp
const deleteDpProspect = async (Proid, DPid) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-Dp-Prospect`, {
      data: { Proid, DPid },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all Dps for a Prospect Service
const getDpsProspect = async Proid => {
  try {
    const response = await axios.get(`${API_URL}/${Proid}/dps`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Display a Dp for a Prospect Service
const displayDpsProspect = async (Proid, DPid) => {
  try {
    const response = await axios.get(`${API_URL}/${Proid}/Dp`, {
      data: { DPid },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all Dps for a Prospect Service
const getAllDpsForProspect = async Proid => {
  try {
    const response = await axios.get(`${API_URL}/${Proid}/dps`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getActiveDpsForProspect = async Proid => {
  try {
    const response = await axios.get(`${API_URL}/${Proid}/active-dps`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getInactiveDpsForProspect = async Proid => {
  try {
    const response = await axios.get(`${API_URL}/${Proid}/inactive-dps`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const ProspectDpService = {
  createDp,
  updateDp,
  deleteDpProspect,
  getDpsProspect,
  displayDpsProspect,
  getDpById,
  getAllDpsForProspect,
  getActiveDpsForProspect,
  getInactiveDpsForProspect,
};
export default ProspectDpService;
