import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

// Sign Up User
export const signUp = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Sign In User
export const signIn = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Sign Out User
export const signOut = async () => {
  try {
    const response = await axios.post(`${API_URL}/signout`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
