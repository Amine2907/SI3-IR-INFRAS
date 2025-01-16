import axios from 'axios';
const API_URL = 'https://si3-ir-infras.onrender.com/api/dashboard';

// Count Dr
const countDr = async () => {
  try {
    const response = await axios.get(`${API_URL}/dr`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Count Devis Recu
const countDevisRecu = async () => {
  try {
    const response = await axios.get(`${API_URL}/devis-recu`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Count Devis En Attente
const countDevisEnAttente = async () => {
  try {
    const response = await axios.get(`${API_URL}/devis-en-attente`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Count Devis Signé
const countDevisSigne = async () => {
  try {
    const response = await axios.get(`${API_URL}/devis-signe`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Count Devis Validation Operateur
const countDevisValidationOpérateur = async () => {
  try {
    const response = await axios.get(`${API_URL}/devis-validation-operateur`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Count Reglement OK
const countReglementOk = async () => {
  try {
    const response = await axios.get(`${API_URL}/reglement-ok`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Count Reglement En Attente
const countReglementEnAttente = async () => {
  try {
    const response = await axios.get(`${API_URL}/reglement-en-attente`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Count Planification Extension
const countPlanificationExtension = async () => {
  try {
    const response = await axios.get(`${API_URL}/planification-extension`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Count Extension OK
const countExtensionOk = async () => {
  try {
    const response = await axios.get(`${API_URL}/extension-ok`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Count Planification Branchements
const countPlanificationBranchements = async () => {
  try {
    const response = await axios.get(`${API_URL}/planification-branchements`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Count Branchement OK
const countBranchementOk = async () => {
  try {
    const response = await axios.get(`${API_URL}/branchement-ok`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Count Consuel Recu
const countConsuelRecu = async () => {
  try {
    const response = await axios.get(`${API_URL}/consuel-recu`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Count Demande MES Realisee
const countDemandeMESRealisee = async () => {
  try {
    const response = await axios.get(`${API_URL}/demande-mes-realisee`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Count Consuel En Attente
const countConsuelEnAttente = async () => {
  try {
    const response = await axios.get(`${API_URL}/consuel-en-attente`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

// Count Demande MES En Attente
const countDemandeMESEnAttente = async () => {
  try {
    const response = await axios.get(`${API_URL}/demande-mes-en-attente`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};

const dashboardService = {
  countDr,
  countDevisRecu,
  countDevisEnAttente,
  countDevisSigne,
  countDevisValidationOpérateur,
  countReglementOk,
  countReglementEnAttente,
  countPlanificationExtension,
  countExtensionOk,
  countPlanificationBranchements,
  countBranchementOk,
  countConsuelRecu,
  countDemandeMESRealisee,
  countConsuelEnAttente,
  countDemandeMESEnAttente,
};

export default dashboardService;
