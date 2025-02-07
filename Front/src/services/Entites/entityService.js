/**
 * This file contains the service for the entities feature.
 * It provides functions to interact with the backend API.
 * The functions are:
 * - createEntity: creates a contact in the database
 * - getAllEntities: gets all the contacts in the database
 * - getActiveEntites: gets all the active contacts in the database
 * - getInactiveEntites: gets all the inactive contacts in the database
 * - getEntityById: gets a contact by its ID
 * - updateEntity: updates a contact in the database
 * - deactivateEntity: deactivates a contact in the database
 * - activateEntity: activates a contact in the database
 * - searchEntities: searches contacts in the database
 */
import axios from 'axios';
const API_URL = 'https://si3-ir-infras.onrender.com/api/entites';
// import dotenv from 'dotenv';
// dotenv.config();
// const API_URL = process.env.ENTITES_API_URL;
// Create entity
const createEntity = async data => {
  try {
    const response = await axios.post(`${API_URL}`, data);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all entities
const getAllEntities = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all active contacts
const getActiveEntites = async () => {
  try {
    const response = await axios.get(`${API_URL}/active`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all inactive contacts
const getInactiveEntites = async () => {
  try {
    const response = await axios.get(`${API_URL}/inactive`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get entity by ID
const getEntityById = async id => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Update entity
const updateEntity = async (id, updates) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updates);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Deactivate an entity
const deactivateEntity = async id => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/deactivate`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Activate an entity
const activateEntity = async id => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/activate`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Search entities
const searchEntities = async filters => {
  try {
    const response = await axios.get(`${API_URL}/search`, { params: filters });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Exporting the entity service
const entityService = {
  createEntity,
  getAllEntities,
  getEntityById,
  updateEntity,
  deactivateEntity,
  activateEntity,
  searchEntities,
  getActiveEntites,
  getInactiveEntites,
};
export default entityService;
