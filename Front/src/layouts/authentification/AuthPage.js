import React, { useState } from 'react';
import SignUpForm from './SignUpFrom';
import SignInForm from './SignInForm';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true); // Controls form toggle

  const toggleAuthForm = () => {
    setIsSignUp(!isSignUp); // Toggle between Sign Up and Sign In
  };

  return (
    <div>
      {isSignUp ? (
        <>
          <SignUpForm />
          <p>
            Already have an account?{' '}
            <button
              onClick={toggleAuthForm}
              style={{ cursor: 'pointer', color: 'blue', border: 'none', background: 'none' }}
            >
              Sign In
            </button>
          </p>
        </>
      ) : (
        <>
          <SignInForm />
          <p>
            Dont have an account?{' '}
            <button
              onClick={toggleAuthForm}
              style={{ cursor: 'pointer', color: 'blue', border: 'none', background: 'none' }}
            >
              Sign Up
            </button>
          </p>
        </>
      )}
    </div>
  );
};
export default AuthPage;
