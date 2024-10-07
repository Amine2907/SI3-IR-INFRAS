import axios from 'axios';
const API_URL = 'http://localhost:5000/api/auth';
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

const signUp = (email, password) => {
  return axios
    .post(`${API_URL}/signup`, { email, password })
    .then(response => response.data)
    .catch(error => {
      console.error('Sign-up error:', error);
      return { success: false };
    });
};
// Check if the user is authenticated
const isAuthenticated = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.token ? true : false;
};

const AuthService = {
  signIn,
  signUp,
  isAuthenticated,
};
export default AuthService;
