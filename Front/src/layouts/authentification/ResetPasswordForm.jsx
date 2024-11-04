import React, { useState } from 'react';
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
import { Alert, AlertDescription } from 'components/ui/alert';
import AuthService from 'services/authService';

export default function PasswordReset() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // useEffect(() => {
  //   const queryParams = new URLSearchParams(window.location.hash.replace('#', '?'));
  //   const token = queryParams.get('access_token');
  //   if (token) {
  //     setAccessToken(token);
  //   } else {
  //     setError("Token d'accès non trouvé. Veuillez vérifier votre lien.");
  //   }
  // }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    // Reset error and message states before each submit
    setError(null);
    setMessage(null);
    // Validate password inputs
    if (!password || password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas. Veuillez réessayer.');
      return;
    }

    // Reset error state before the request
    setError(null);

    try {
      // Call the password reset service with password, accessToken, and recoveryType
      const result = await AuthService.updatePassword(password);

      // Handle the response from the service
      if (result.success) {
        setMessage('Le mot de passe a été réinitialisé avec succès.');
        setPassword(''); // Clear password fields after success
        setConfirmPassword(''); // Clear confirm password field
      } else {
        setError(
          result.error ||
            'Une erreur s&apos;est produite lors de la réinitialisation du mot de passe.'
        );
        setMessage(null);
      }
    } catch (err) {
      setError(
        err.message || 'Une erreur s&apos;est produite lors de la réinitialisation du mot de passe.'
      ); // Ensure error message is clear
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
                type="password"
                placeholder="Nouveau Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Input
                id="confirmPassword"
                type="password"
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
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
