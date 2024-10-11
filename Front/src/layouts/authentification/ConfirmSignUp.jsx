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
    } else {
      console.error('No token found in URL.');
    }
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 3000);
    return () => clearTimeout(timer);
  }, [token, navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Account Confirmation</h1>
      {token ? (
        <p>Your account has been confirmed! You will be redirected to the login page shortly.</p>
      ) : (
        <p>
          Your account could not be confirmed. Please check your email for the confirmation link.
        </p>
      )}
    </div>
  );
};
export default ConfirmSignup;
