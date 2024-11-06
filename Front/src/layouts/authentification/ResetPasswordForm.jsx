/**
 * ResetPasswordForm component.
 *
 * This component is responsible for allowing users to reset their passwords.
 * It provides inputs for the new password and its confirmation, and handles
 * the password reset process using the AuthService.
 *
 * Key functionalities:
 * - Allows users to input a new password and confirm it.
 * - Toggles the visibility of the password input.
 * - Validates that the new password and confirmation match.
 * - Displays error messages if the reset process fails.
 * - Navigates the user to a different page upon successful password reset.
 *
 * State variables:
 * - password: Stores the new password input by the user.
 * - showPassword: Toggles the visibility of the password input.
 * - confirmPassword: Stores the confirmation of the new password.
 * - error: Holds error messages to display to the user.
 * - message: Holds success messages to display to the user.
 * - accessToken: Stores the access token required for the password reset.
 * - refresh_token: Stores the refresh token if needed for the process.
 *
 * @returns {React.ReactElement} The ResetPasswordForm component.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'components/ui/card';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Alert, AlertDescription } from 'components/ui/alert';
import AuthService from 'services/authService';
export default function PasswordReset() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [refresh_token, setRefreshToken] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    // Extract token from URL hash
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const token = hashParams.get('access_token');
    const refresh_token = hashParams.get('refresh_token');
    if (token && refresh_token) {
      setAccessToken(token);
      setRefreshToken(refresh_token);
      console.log('Access token set:', token);
      console.log('Access token set:', refresh_token);
    } else {
      console.error('No access token found in URL hash');
    }
  }, []);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!accessToken || !refresh_token) {
      setMessage(
        'No access token or refresh token available. Please try resetting your password again.'
      );
      return;
    }
    // Reset error and message states before each submit
    setError(null);
    setMessage(null);
    // Validate password inputs
    if (!password || password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas. Veuillez réessayer.');
      return;
    }
    try {
      // Call the password reset service with email, password, and accessToken
      const result = await AuthService.updatePassword(password, accessToken, refresh_token);

      // Handle the response from the service
      if (result.success) {
        setMessage(
          'Le mot de passe a été réinitialisé avec succès.On va vous diriger vers la page de connexion dans 5 secondes'
        );
        setPassword(''); // Clear password fields after success
        setConfirmPassword(''); // Clear confirm password field
        setTimeout(() => {
          navigate('/auth');
        }, 5000);
      } else {
        setError(
          result.error || "Une erreur s'est produite lors de la réinitialisation du mot de passe."
        );
        setMessage(null);
      }
    } catch (err) {
      setError(
        err.message || "Une erreur s'est produite lors de la réinitialisation du mot de passe."
      );
      setMessage(null);
    }
  };
  return (
    <Card className="w-[350px] mx-auto mt-16">
      <CardHeader>
        <CardTitle>Réinitialiser le mot de passe</CardTitle>
        <CardDescription>Entrez votre nouveau mot de passe ci-dessous</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nouveau Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirmer mot de passe"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {message && (
            <Alert variant="success" className="mt-4">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          <CardFooter className="flex justify-between mt-4 px-0">
            <Button type="submit">Réinitialiser le mot de passe</Button>
            <button type="button" onClick={togglePasswordVisibility}>
              {' '}
              {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
