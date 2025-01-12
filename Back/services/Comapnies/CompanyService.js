/**
 * This file contains the service for the Companys feature.
 * It provides functions to interact with the backend API.
 * The functions are:
 * - createCompany: creates a Company in the database
 * - getAllCompanys: gets all the Companys in the database
 * - getCompanyById: gets a Company by its ID
 * - updateCompany: updates a Company in the database
 * - deactivateCompany: deactivates a Company in the database
 * - activateCompany: activates a Company in the database
 * - searchCompanys: searches Companys in the database
 * - getActiveCompanys: gets all the active Companys in the database
 * - getInactiveCompanys: gets all the inactive Companys in the database
 */
import axios from 'axios';
const API_URL = 'http://localhost:5000/api/companies';

// Create Company
const createCompany = async data => {
  try {
    const response = await axios.post(`${API_URL}`, data);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all Companys
const getAllCompanys = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all active Companys
const getActiveCompanys = async () => {
  try {
    const response = await axios.get(`${API_URL}/active`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all inactive Companys
const getInactiveCompanys = async () => {
  try {
    const response = await axios.get(`${API_URL}/inactive`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get Company by ID
const getCompanyById = async id => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Update Company
const updateCompany = async (id, updates) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updates);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Deactivate a Company
const deactivateCompany = async id => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/deactivate`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Activate a Company
const activateCompany = async id => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/activate`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Exporting the Company service
const CompanyService = {
  createCompany,
  getAllCompanys,
  getCompanyById,
  updateCompany,
  deactivateCompany,
  activateCompany,
  getActiveCompanys,
  getInactiveCompanys,
};
export default CompanyService;
