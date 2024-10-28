/**
 * This file contains functions for user authentication
 * - `signIn`: signs in the user and returns the user if successful
 * - `signUp`: signs up the user and returns the user if successful
 * - `isAuthenticated`: checks if the user is authenticated
 * @module authService
 */
import axios from 'axios';
const API_URL = 'http://localhost:5000/api/auth';
// import dotenv from 'dotenv';
// dotenv.config();
// const API_URL = process.env.AUTH_URL;
// Error handling helper
// const handleError = error => {
//   return { success: false, error: error.response ? error.response.data.error : error.message };
// };
// Sign in the user
const signIn = async (email, password) => {
  return await axios
    .post(`${API_URL}/signin`, { email, password })
    .then(response => {
      if (response.data.user && response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    })
    .catch(error => {
      console.error('Sign-in error:', error.response.data.error || error.message);
      return { success: false, message: error.response.data.error || 'Unknown error' };
    });
};
// Sign Up the user
const signUp = async (firstName, lastName, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Sign-up error:', error.response?.data.error || error.message);
    return { success: false, error: error.response?.data.error || 'Unknown error' };
  }
};
// Check if the user is authenticated
const isAuthenticated = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.token ? true : false;
};
// Password reset for the user
// Function to initiate password reset
const resetPassword = async email => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, { email });
    return response.data;
  } catch (error) {
    console.error('Resetting password failed!', error.response?.data || error);
    return {
      success: false,
      error: error.response?.data?.error || 'Unknown error occurred during password reset',
    };
  }
};

// Function to confirm password reset for the user
const confirmResetPassword = async (access_token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/confirm-reset-password`, {
      access_token: access_token,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Password reset confirmation failed!', error.response?.data || error);
    return {
      success: false,
      error:
        error.response?.data?.error || 'Unknown error occurred during password reset confirmation',
    };
  }
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
