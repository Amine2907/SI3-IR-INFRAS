import axios from 'axios';
const API_URL = `${process.env.BACKEND_URL}/api/traveaux`;
// Create trav Service
const createTrav = async ({ Sid, traveauxData }) => {
  try {
    console.log('SeTiding request:', { Sid, traveauxData });
    const response = await axios.post(`${API_URL}/create-trav-site`, {
      Sid,
      traveauxData,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Update trav Service
const updateTrav = async (Tid, updates) => {
  console.log('Updates being sent:', updates);
  try {
    const response = await axios.put(`${API_URL}/${Tid}`, updates);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// get traveaux by ID Service
const getTravById = async Tid => {
  try {
    const response = await axios.get(`${API_URL}/${Tid}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// get active libelle de virments
const getActiveLibelle = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-libelle`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all traveaux for a site Service
const getTravSite = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/trav`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Display a trav for a site Service
const displayTravSite = async (Sid, Tid) => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/travs`, {
      data: { Tid },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getActiveTrav = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-trav`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getinactiveTrav = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/active-trav`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const siteTravService = {
  createTrav,
  updateTrav,
  getTravSite,
  displayTravSite,
  getTravById,
  getActiveTrav,
  getinactiveTrav,
  getActiveLibelle,
};
export default siteTravService;
