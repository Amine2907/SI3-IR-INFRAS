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
import { useParams } from 'react-router-dom'; // Import useParams

export default function PasswordReset() {
  const { userId } = useParams(); // Get userId from URL params
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Check if userId is available
    if (!userId) {
      setError('Missing user ID. Please try the reset password process again.');
    }
  }, [userId]);

  const handleSubmit = async e => {
    e.preventDefault();

    // Password complexity check
    const passwordComplexityCheck = password => {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;
    };

    // Check password complexity
    if (!passwordComplexityCheck(password)) {
      setError('Password must include uppercase, lowercase, number, and special character.');
      setMessage(null); // Clear any previous messages
      return;
    }

    // Check if passwords match
    if (!password || password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      setMessage(null); // Clear any previous messages
      return;
    }

    try {
      // Check if userId is available
      if (!userId) {
        setError('Missing user ID. Please try the reset password process again.');
        setMessage(null); // Clear any previous messages
        return;
      }

      // Call the updatePassword method
      const result = await AuthService.updatePassword(userId, password);
      if (result.success) {
        setMessage('Password reset successfully.');
        setError(null); // Clear any previous errors
      } else {
        setError(result.error || 'An error occurred');
        setMessage(null); // Clear any previous messages
      }
    } catch (err) {
      setError(err.message || 'An error occurred'); // Improved error handling
      setMessage(null); // Clear any previous messages
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
