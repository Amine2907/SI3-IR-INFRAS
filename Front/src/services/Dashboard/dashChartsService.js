import axios from 'axios';
import config from '../../config.js';
const API_URL = config.DASH_CHARTS_URL;
// Fetch DR count by programme
const getDRCountByProgramme = async () => {
  try {
    const response = await axios.get(`${API_URL}/dr-by-programme`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Fetch Devis Reçu by programme
const getDevisRecuByProgramme = async () => {
  try {
    const response = await axios.get(`${API_URL}/devis-recu-by-programme`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Fetch Devis En Attente by programme
const getDevisEnAttenteByProgramme = async () => {
  try {
    const response = await axios.get(`${API_URL}/devis-en-attente-by-programme`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Fetch Devis Signé by programme
const getDevisSigneByProgramme = async () => {
  try {
    const response = await axios.get(`${API_URL}/devis-signe-by-programme`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Fetch Devis Validation Operateur by programme
const getDevisValidationOperateurByProgramme = async () => {
  try {
    const response = await axios.get(`${API_URL}/devis-validation-operateur-by-programme`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Fetch Reglement OK by programme
const getReglementOkByProgramme = async () => {
  try {
    const response = await axios.get(`${API_URL}/reglement-ok-by-programme`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Fetch Reglement En Attente by programme
const getReglementEnAttenteByProgramme = async () => {
  try {
    const response = await axios.get(`${API_URL}/reglement-en-attente-by-programme`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Fetch Planification Extension by programme
const getPlanificationExtensionByProgramme = async () => {
  try {
    const response = await axios.get(`${API_URL}/planification-extension-by-programme`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Fetch Extension OK by programme
const getExtensionOkByProgramme = async () => {
  try {
    const response = await axios.get(`${API_URL}/extension-ok-by-programme`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Fetch Planification Branchements by programme
const getPlanificationBranchementsByProgramme = async () => {
  try {
    const response = await axios.get(`${API_URL}/planification-branchements-by-programme`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Fetch Branchement OK by programme
const getBranchementOkByProgramme = async () => {
  try {
    const response = await axios.get(`${API_URL}/branchement-ok-by-programme`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Fetch Consuel Reçu by programme
const getConsuelRecuByProgramme = async () => {
  try {
    const response = await axios.get(`${API_URL}/consuel-recu-by-programme`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Fetch Demande MES Réalisée by programme
const getDemandeMESRealiseeByProgramme = async () => {
  try {
    const response = await axios.get(`${API_URL}/demande-mes-realisee-by-programme`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Fetch Consuel En Attente by programme
const getConsuelEnAttenteByProgramme = async () => {
  try {
    const response = await axios.get(`${API_URL}/consuel-en-attente-by-programme`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Fetch Demande MES En Attente by programme
const getDemandeMESEnAttenteByProgramme = async () => {
  try {
    const response = await axios.get(`${API_URL}/demande-mes-en-attente-by-programme`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Export the service
const dashChartsService = {
  getDRCountByProgramme,
  getDevisRecuByProgramme,
  getDevisEnAttenteByProgramme,
  getDevisSigneByProgramme,
  getDevisValidationOperateurByProgramme,
  getReglementOkByProgramme,
  getReglementEnAttenteByProgramme,
  getPlanificationExtensionByProgramme,
  getExtensionOkByProgramme,
  getPlanificationBranchementsByProgramme,
  getBranchementOkByProgramme,
  getConsuelRecuByProgramme,
  getDemandeMESRealiseeByProgramme,
  getConsuelEnAttenteByProgramme,
  getDemandeMESEnAttenteByProgramme,
};
export default dashChartsService;
