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
  const updateProspect = async ({ Sid, prospectData }) => {
    try {
      const response = await axios.put(`${API_URL}/update-prospect-site`, {
        Sid,       
        prospectData,
      });
      return { success: true, data: response.data };
    } catch (error) {
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
    const response = await axios.get(`${API_URL}/${Sid}/contacts`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const displayProspectsSite = async (Sid, Proid) => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/contact`, {
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
};
export default SiteProspectService;
