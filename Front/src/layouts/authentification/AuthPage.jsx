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
            Vous avez déjà un compte ?{' '}
            <button
              onClick={toggleAuthForm}
              style={{ cursor: 'pointer', color: 'blue', border: 'none', background: 'none' }}
            >
              Se connecter
            </button>
          </p>
        </>
      ) : (
        <>
          <SignInForm />
          <p>
            Vous n&apos;avez pas de compte ?{' '}
            <button
              onClick={toggleAuthForm}
              style={{ cursor: 'pointer', color: 'blue', border: 'none', background: 'none' }}
            >
              S&apos;inscrire
            </button>
          </p>
        </>
      )}
    </div>
  );
};
export default AuthPage;
