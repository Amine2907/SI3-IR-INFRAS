import axios from 'axios';
const API_URL = 'http://localhost:5000/api/auth';
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
const updatePassword = async (newPassword, accessToken, refresh_token) => {
  try {
    const response = await axios.post(
      `${API_URL}/update-password`,
      { newPassword, accessToken, refresh_token },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error('An error occurred while updating password');
  }
};
// Function to sign the user out
const signOutUser = async userId => {
  try {
    const response = await axios.post(`${API_URL}/sign-out`, { userId });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An error occurred while signing out');
  }
};
// Exporting functions (for call AuthService.func)
const AuthService = {
  signIn,
  signUp,
  isAuthenticated,
  resetPassword,
  updatePassword,
  signOutUser,
};
export default AuthService;
