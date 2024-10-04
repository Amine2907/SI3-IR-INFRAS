import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const signIn = (email, password) => {
  return axios
    .post(`${API_URL}/signin`, { email, password })
    .then(response => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    })
    .catch(error => {
      console.error('Sign-in error:', error);
      return { success: false };
    });
};
const signUp = (email, password) => {
  return axios
    .post(`${API_URL}/signup`, { email, password })
    .then(response => response.data) // Remove parentheses around `response`
    .catch(error => {
      console.error('Sign-up error:', error);
      return { success: false };
    });
};

const AuthService = {
  signIn,
  signUp,
};

export default AuthService;
