import axios from 'axios';
import config from '../../config.js';
const API_URL = config.SITE_CONTACTS_URL;
const addExistingSiteContacts = async ({ Sid, Cids }) => {
  try {
    // Ensure Sid and Cids are not undefined
    if (!Sid || !Array.isArray(Cids) || Cids.length === 0) {
      throw new Error('Sid and an array of Cids are required');
    }
    // Send the request to the backend with the correct payload structure
    const response = await axios.post(`${API_URL}/add-contact-site`, { Sid, Cids });
    // Handle the response from the backend
    if (response.data && response.data.data) {
      return { success: true, data: response.data.data };
    } else {
      return { success: false, error: 'No response data received from server' };
    }
  } catch (error) {
    console.error('Error associating contacts:', error.message);
    return {
      success: false,
      error: error.response ? error.response.data.error : error.message,
    };
  }
};
const addNewContactSite = async ({ Sid, contactData }) => {
  try {
    const response = await axios.post(`${API_URL}/add-new-contact-site`, {
      Sid,
      contactData,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const deleteContactSite = async (Sid, Cid) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-contact-site`, {
      data: { Sid, Cid },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const getContactsSite = async Sid => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/contacts`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const displayContactsSite = async (Sid, Cid) => {
  try {
    const response = await axios.get(`${API_URL}/${Sid}/contact`, {
      data: { Cid },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
const siteContactService = {
  addExistingSiteContacts,
  addNewContactSite,
  deleteContactSite,
  getContactsSite,
  displayContactsSite,
};
export default siteContactService;
