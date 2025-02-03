/**
 * This file contains functions for the settings feature
 * - `getAccountInfo`: gets the information of the current user
 * - `updatePassword`: updates the password of the current user
 * @module settingsService
 */
import axios from 'axios';
import config from '../../config.js';
const API_BASE_URL = config.SETTINGS_URL;
// 1. Get Account Information
const getAccountInfo = async userId => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return { success: false, error: 'No token found' };
    }
    const response = await axios.get(`${API_BASE_URL}/account/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('API Response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching account info:', error);
    console.error('API Error Response:', error.response ? error.response.data : 'No response');
    return { success: false, error: error.response?.data || error.message };
  }
};
// 2. Update Password
const updatePassword = async (userId, currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return { success: false, error: 'No token found' };
    }
    const response = await axios.put(
      `${API_BASE_URL}/account/password/${userId}`,
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};
// 3. Update User Account informations
const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/account/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return { success: true, data: response.data };
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
// Exporting all service functions
const settingsService = {
  getAccountInfo,
  updatePassword,
  listUsers,
  updateUser,
};
export default settingsService;
