/**
 * This file contains functions for user authentication
 * - `signIn`: signs in the user and returns the user if successful
 * - `signUp`: signs up the user and returns the user if successful
 * - `isAuthenticated`: checks if the user is authenticated
 * @module authService
 */
import axios from 'axios';
const API_URL = 'http://localhost:5000/api/auth';
// Error handling helper
const handleError = (error) => {
  return { success: false, error: error.response ? error.response.data.error : error.message };
};
// Sign in the user 
const signIn = (email, password) => {
  return axios
    .post(`${API_URL}/signin`, { email, password })
    .then(response => {
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    })
    .catch(error => {
      console.error('Sign-in error:', error.response.data.error || error.message);
      return { success: false, message: error.response.data.error || 'Unknown error' };
    });
};
// Sign Up the user 
const signUp = (firstName, lastName, email, password) => {
  return axios
    .post(`${API_URL}/signup`, { firstName, lastName, email, password })
    .then(response => response.data)
    .catch(error => {
      console.error('Sign-up error:', error.response?.data.error || error.message);
      return { success: false, error: error.response?.data.error || 'Unknown error' };
    });
};
// Check if the user is authenticated
const isAuthenticated = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.token ? true : false;
};
// Password reset for the user
const resetPassword = async (email) => {
  return axios
    .post(`${API_URL}/reset-password#access_token=${access_token}`, { email })
    .then(response => response.data)
    .catch(error => {
      console.error('Reseting password failed !', error.response?.data || error);
      return { success: false, error: error.response?.data?.error || 'Unknown error' };
    });
};
// Confirm reseting password for the user 
const confirmResetPassword = async (newPassword, access_token) => {
  return axios
    .post(`${API_URL}/confirm-reset-password#access_token=${access_token}`, { newPassword})
    .then(response => response.data)
    .catch(error => {
      console.error('Password reset failed!', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Unknown error' 
      };
    });
};
// Exporting functions (for call AuthService.func)
const AuthService = {
  signIn,
  signUp,
  isAuthenticated,
  resetPassword,
  confirmResetPassword,
};
export default AuthService;
