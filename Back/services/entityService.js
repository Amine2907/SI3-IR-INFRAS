import axios from 'axios';
const API_URL = 'http://localhost:5000/api/entite';

// Error handling helper
const handleError = (error) => {
    return { success: false, error: error.response ? error.response.data.error : error.message };
};
// Create entity
const createEntity = async (data) => {
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
// Get entity by ID
const getEntityById = async (id) => {
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
const deactivateEntity = async (id) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}/deactivate`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response ? error.response.data.error : error.message };
    }
};
// Activate an entity
const activateEntity = async (id) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}/activate`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response ? error.response.data.error : error.message };
    }
};
// Search entities
const searchEntities = async (filters) => {
    try {
        const response = await axios.post(`${API_URL}/search`, filters);
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
};

export default entityService;
