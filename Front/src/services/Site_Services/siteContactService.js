import axios from 'axios';
const API_URL = 'http://localhost:5000/api/siteContact';
const addContactSite = async () => {
  try {
    const response = await axios.post(`${API_URL}/add-contact-site`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
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
  addContactSite,
  addNewContactSite,
  deleteContactSite,
  getContactsSite,
  displayContactsSite,
};
export default siteContactService;
