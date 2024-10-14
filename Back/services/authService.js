import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import express from 'express';
const API_URL = 'http://localhost:5000/api/auth';
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
    .post(`${API_URL}/reset-password?token=${token}`, { email })
    .then(response => response.data)
    .catch(error => {
      console.error('Reseting password failed !', error.response?.data || error);
      return { success: false, error: error.response?.data?.error || 'Unknown error' };
    });
};
// Confirm reseting password for the user 
const confirmResetPassword = async (newPassword, token) => {
  return axios
    .post(`${API_URL}/confirm-reset-password?token=${token}`, { newPassword, token })
    .then(response => response.data)
    .catch(error => {
      console.error('Password reset failed!', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Unknown error' 
      };
    });
};
// export const confirmUser = async (tokenHash, type, next) => {
//   try {
//     const response = await axios.post(`${API_URL}/confirm`, { token_hash: tokenHash, type, next });
//     return response.data;
//   } catch (error) {
//     console.error('Error confirming user:', error);
//     throw error;
//   };
// };
// Exporting functions (for call AuthService.func)
const AuthService = {
  signIn,
  signUp,
  isAuthenticated,
  resetPassword,
  confirmResetPassword,
  // confirmUser,
};
export default AuthService;
