import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmSignup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to /auth after 3 seconds
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 10000);
    // Cleanup the timer on unmount
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Account Confirmation</h1>
      <p>Your account has been confirmed! You will be redirected to the login page shortly.</p>
      {/* <p>
          Your account could not be confirmed. Please check your email for the confirmation link.
        </p> */}
    </div>
  );
};
export default ConfirmSignup;
