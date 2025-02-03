/**
 * This file contains the service for the contacts feature.
 * It provides functions to interact with the backend API.
 * The functions are:
 * - createContact: creates a contact in the database
 * - getAllContacts: gets all the contacts in the database
 * - getContactById: gets a contact by its ID
 * - updateContact: updates a contact in the database
 * - deactivateContact: deactivates a contact in the database
 * - activateContact: activates a contact in the database
 * - searchContacts: searches contacts in the database
 * - getActiveContacts: gets all the active contacts in the database
 * - getInactiveContacts: gets all the inactive contacts in the database
 */
import axios from 'axios';
import config from '../../config.js';
const API_URL = config.CONTACTS_URL;
// Create contact
const createContact = async data => {
  try {
    const response = await axios.post(`${API_URL}`, data);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all contacts
const getAllContacts = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all active contacts
const getActiveContacts = async () => {
  try {
    const response = await axios.get(`${API_URL}/active`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get all inactive contacts
const getInactiveContacts = async () => {
  try {
    const response = await axios.get(`${API_URL}/inactive`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Get contact by ID
const getContactById = async id => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Update contact
const updateContact = async (id, updates) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updates);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Deactivate a contact
const deactivateContact = async id => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/deactivate`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Activate a contact
const activateContact = async id => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/activate`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Search contacts
const searchContacts = async filters => {
  try {
    const response = await axios.get(`${API_URL}/search`, { params: filters });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// Exporting the contact service
const contactService = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deactivateContact,
  activateContact,
  searchContacts,
  getActiveContacts,
  getInactiveContacts,
};
export default contactService;
