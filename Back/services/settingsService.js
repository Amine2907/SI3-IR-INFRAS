/**
 * This file contains functions for the settings feature
 * - `getAccountInfo`: gets the information of the current user
 * - `updatePassword`: updates the password of the current user
 * @module settingsService
 */
import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000/api/settings';

// Error handling helper
const handleError = (error) => {
    return { success: false, error: error.response ? error.response.data.error : error.message };
};
// 1. Get Account Information
const getAccountInfo = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/account`, {
            withCredentials: true,
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};
// 2. Update Password
const updatePassword = async (currentPassword, newPassword) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/account/password`, {
            currentPassword,
            newPassword,
        }, {
            withCredentials: true,
        });
        return { success: true, message: response.data.message };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};

// 3. List All Users
const listUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`, {
            withCredentials: true,
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};
// 4. List All Companies
const listCompanies = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/companies`, {
            withCredentials: true,
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};
// Exporting all service functions
const settingsService = {
    getAccountInfo,
    updatePassword,
    listUsers,
    listCompanies,
};
export default settingsService;
