import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ConfirmSignup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get('token');
  useEffect(() => {
    if (token) {
      console.log('Token received:', token);
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    } else {
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    }
  }, [token, navigate]);
  return (
    <div>
      <h1>Confirm Your Signup</h1>
      {token ? (
        <p>Your signup has been confirmed! You can now log in.</p>
      ) : (
        <p>No valid token found. Please check the link you received.</p>
      )}
    </div>
  );
};
export default ConfirmSignup;
