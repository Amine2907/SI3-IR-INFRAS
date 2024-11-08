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
import dotenv from 'dotenv'; 
dotenv.config();
const API_URL = process.env.BACK_COMPANIES_API || 'your-Site-api-url';
// Create Site
const createSite = async (data) => {
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
const getSiteById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response ? error.response.data.error : error.message };
    }
};
// Update Site
const updateSite = async (id, updates) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, updates);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response ? error.response.data.error : error.message };
    }
};
// Deactivate a Site
const deactivateSite = async (id) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}/deactivate`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response ? error.response.data.error : error.message };
    }
};
// Activate a Site
const activateSite = async (id) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}/activate`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response ? error.response.data.error : error.message };
    }
};
const searchSites = async (filters) => {
  try {
      const response = await axios.get(`${API_URL}/search`, { params: filters });
      return { success: true, data: response.data };
  } catch (error) {
      return { success: false, error: error.response ? error.response.data.error : error.message };
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
};
export default SiteService;
