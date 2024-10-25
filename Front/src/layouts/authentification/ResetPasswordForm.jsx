import React, { useState, useEffect } from 'react';
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
  const access_token = new URLSearchParams(window.location.search).get('access_token');

  useEffect(() => {
    if (!access_token) {
      setError('Missing reset token. Please try the reset password process again.');
    }
  }, [access_token]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!access_token) {
      setError('Missing reset token. Please try the reset password process again.');
      return;
    }

    if (!password || password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    console.log('Access Token:', access_token); // Log the token for debugging
    console.log('Password:', password); // Log the password for debugging

    try {
      const result = await AuthService.confirmResetPassword(access_token, password);
      if (result.success) {
        setMessage('Password reset successfully.');
        setError(null);
      } else {
        setError(result.error || 'An error occurred');
        setMessage(null);
      }
    } catch (err) {
      setError(err.error || 'An error occurred');
      setMessage(null);
    }
  };

  return (
    <Card className="w-[350px] mx-auto mt-16">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input
                id="password"
                type="password"
                placeholder="New Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm New Password"
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
            <Button type="submit">Reset Password</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
