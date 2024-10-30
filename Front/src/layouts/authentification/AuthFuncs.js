/**
 * Authentication functions for handling sign-in, sign-up, and password reset.
 * These functions handle interactions with the AuthService and manage user session.
 */

import AuthService from 'services/authService';

// Handle sign-in functionality
export const handleSignIn = async (email, password, login, setError, navigate) => {
  try {
    const response = await AuthService.signIn(email, password);
    if (!response.success) {
      setError('Identifiants invalides, veuillez réessayer.');
      return;
    }
    const { user, accessToken } = response;
    if (accessToken) {
      login(user, accessToken);
      localStorage.setItem('token', accessToken);
      navigate('/dashboard');
    } else {
      setError("Token d'accès manquant.");
    }
  } catch (err) {
    setError('Erreur de connexion, veuillez réessayer.');
  }
};

// Handle sign-up functionality
export const handleSignUp = async (firstName, lastName, email, password, setError, setMessage) => {
  try {
    const response = await AuthService.signUp(firstName, lastName, email, password);
    if (response?.success) {
      setMessage(response.data?.message || 'Inscription réussie ! Veuillez vérifier votre e-mail.');
      setError('');
    } else {
      setError(response?.data?.message || "L'inscription a échoué. Veuillez réessayer.");
      setMessage('');
    }
  } catch (error) {
    setError(error?.response?.data?.message || "Une erreur s'est produite lors de l'inscription.");
    setMessage('');
  }
};

// Handle password reset functionality
export const handleResetPassword = async (resetEmail, setError, setMessage) => {
  try {
    const response = await AuthService.resetPassword(resetEmail);
    if (response?.success) {
      setMessage('Un e-mail de réinitialisation a été envoyé.');
    } else {
      setError(response?.data?.message || 'La réinitialisation du mot de passe a échoué.');
    }
  } catch (error) {
    setError(
      error?.response?.data?.message || "Une erreur s'est produite lors de la réinitialisation."
    );
  }
};
