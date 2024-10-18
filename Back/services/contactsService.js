import axios from 'axios';
const API_URL = 'http://localhost:5000/api/contacts';
// Error handling helper
const handleError = (error) => {
    return { success: false, error: error.response ? error.response.data.error : error.message };
};
// Create contact
const createContact = async (data) => {
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
// Get contact by ID
const getContactById = async (id) => {
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
const deactivateContact = async (id) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}/deactivate`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response ? error.response.data.error : error.message };
    }
};
// Activate a contact
const activateContact = async (id) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}/activate`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response ? error.response.data.error : error.message };
    }
};
// Search contacts
const searchContacts = async (filters) => {
    try {
        const response = await axios.get(`${API_URL}/search`, filters);
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
};
export default contactService;
