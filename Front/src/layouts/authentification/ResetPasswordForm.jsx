/**
 * This page is responsible for resetting a user's password.
 *
 * It takes a reset password token from the URL and uses it to verify the
 * user's identity. If the user is verified, it will render a form to reset
 * the user's password. If the user is not verified, it will render an error
 * message.
 *
 * @return {React.ReactElement} The reset password page.
 */
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AuthService from 'services/authService';
import { Card, CardContent } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const access_token = urlParams.get('access_token');

  const handleResetPassword = async e => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    const result = await AuthService.confirmResetPassword(newPassword, access_token);
    if (result.success) {
      setSuccessMessage('Votre mot de passe a été réinitialisé avec succès !');
      setErrorMessage(''); // Clear error message on success
    } else {
      setErrorMessage(result.error);
      setSuccessMessage(''); // Clear success message on error
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96">
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold text-center">Réinitialiser le mot de passe</h2>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button className="w-full mb-4" type="submit">
                Réinitialiser le mot de passe
              </Button>
              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
              {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default ResetPasswordForm;
