import axios from 'axios';
const API_URL = 'http://localhost:5000/api/prospect';
const createProspect = async ({ Sid, prospectData }) => {
    try {
      const response = await axios.post(`${API_URL}/create-prospect-site`, {
        Sid,
        prospectData,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response ? error.response.data.error : error.message };
    }
  };
  const updateProspect = async (Proid, updates) => {
    try {
      const response = await axios.put(`${API_URL}/${Proid}`, updates);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response ? error.response.data.error : error.message };
    }
  };
const getProspectById = async Proid => {
    try {
        const response = await axios.get(`${API_URL}/${Proid}`);
        return { success: true, data: response.data };
    } catch(error){
        return { success: false, error: error.response ? error.response.data.error : error.message };
    }
}
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
const getProspectsSite = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/prospects`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
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
const SiteProspectService = {
  createProspect,
  updateProspect,
  deleteProspectSite,
  getProspectsSite,
  displayProspectsSite,
  getProspectById,
};
export default SiteProspectService;
