/**
 * This file contains the service for the Sites feature.
 * It provides functions to interact with the backend API.
 * The functions are:
 * - createSite: creates a Site in the database
 * - getAllSites: gets all the Sites in the database
 * - getSiteById: gets a Site by its ID
 * - updateSite: updates a Site in the database
 * - deactivateSite: deactivates a Site in the database
 * - activateSite: activates a Site in the database
 * - searchSites: searches Sites in the database
 * - getActiveSites: gets all the active Sites in the database
 * - getInactiveSites: gets all the inactive Sites in the database
 */
import axios from 'axios';
// import dotenv from 'dotenv';
// dotenv.config();
// const API_URL = process.env.BACK_COMPANIES_API || 'your-Site-api-url';
const API_URL = 'http://localhost:5000/api/site';
// Create Site
const createSite = async data => {
  try {
    const response = await axios.post(`${API_URL}`, data);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all Sites
const getAllSites = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all active Sites
const getActiveSites = async () => {
  try {
    const response = await axios.get(`${API_URL}/active`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all inactive Sites
const getInactiveSites = async () => {
  try {
    const response = await axios.get(`${API_URL}/inactive`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get Site by ID
const getSiteById = async EB => {
  try {
    const response = await axios.get(`${API_URL}/${EB}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Update Site
const updateSite = async (EB, updates) => {
  try {
    const response = await axios.put(`${API_URL}/${EB}`, updates);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Deactivate a Site
const deactivateSite = async EB => {
  try {
    const response = await axios.patch(`${API_URL}/${EB}/deactivate`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Activate a Site
const activateSite = async EB => {
  try {
    const response = await axios.patch(`${API_URL}/${EB}/activate`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Search Sites based on filters
const searchSites = async filters => {
  try {
    const response = await axios.get(`${API_URL}/search`, { params: filters });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getActiveCompanies = async () => {
  try {
    const response = await axios.get(`${API_URL}/active-companies`);
    return { success: true, data: response.data }; // Assuming the data is in response.data
  } catch (error) {
    return { success: false, error: error.message };
  }
};
// Exporting the Site service
const SiteService = {
  createSite,
  getAllSites,
  getSiteById,
  updateSite,
  deactivateSite,
  activateSite,
  getActiveSites,
  getInactiveSites,
  searchSites,
  getActiveCompanies,
};
export default SiteService;
