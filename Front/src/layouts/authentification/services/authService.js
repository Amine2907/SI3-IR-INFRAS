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
