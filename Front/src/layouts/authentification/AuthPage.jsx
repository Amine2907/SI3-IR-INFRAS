'use client';
import React, { useState, useEffect } from 'react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import AuthService from 'services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'context/Auth/AuthContext';
import { Alert, AlertDescription } from 'components/ui/alert';
export default function AuthPage() {
  const [FullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Clear messages after 10 seconds
    const timer = setTimeout(() => {
      setError('');
      setMessage('');
    }, 10000);

    return () => clearTimeout(timer); // Cleanup the timeout on component unmount
  }, [error, message]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // HANDLE SIGN IN HERE
  const handleSignIn = async e => {
    e.preventDefault(); // Prevent the default form submission
    const response = await AuthService.signIn(email, password);
    // Check the response
    if (response.success === false) {
      setError('Identifiants invalides, veuillez réessayer.');
    } else {
      console.log('Connexion réussie :', response);
      login();
      navigate('/dashboard');
    }
  };
  // HANDLE SIGN UP HERE
  const handleSignUp = async e => {
    e.preventDefault();
    try {
      const response = await AuthService.signUp(FullName, email, password);
      if (response && response.success) {
        if (response.data && response.data.message) {
          setMessage(response.data.message);
          setEmail('');
          setPassword('');
          setFullName('');
        } else {
          setMessage('Inscription réussie ! Veuillez vérifier votre e-mail.');
        }
        setError('');
      } else {
        setError(response?.data?.message || "L'inscription a échoué. Veuillez réessayer.");
        setMessage('');
      }
    } catch (error) {
      console.error("Erreur d'inscription", error);
      setError(
        error?.response?.data?.message ||
          "Une erreur s'est produite lors de l'inscription. Veuillez réessayer."
      );
      setMessage('');
    }
  };
  // HANDLE RESET PASSWORD HERE
  const handleResetPassword = async e => {
    e.preventDefault();
    try {
      const response = await AuthService.resetPassword(resetEmail);
      if (response && response.success) {
        setMessage('Un e-mail de réinitialisation a été envoyé.');
        setResetEmail('');
      } else {
        setError(
          response?.data?.message ||
            'La réinitialisation du mot de passe a échoué. Veuillez réessayer.'
        );
      }
    } catch (error) {
      console.error('Erreur de réinitialisation du mot de passe', error);
      setError(
        error?.response?.data?.message ||
          "Une erreur s'est produite lors de la réinitialisation du mot de passe. Veuillez réessayer."
      );
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
        <Card className="w-full lg:w-1/2">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Bienvenue au SI3</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                SI3 aide à stocker, organiser et sécuriser les données tout au long du cycle de vie
                de la construction des pylônes. Avec SI3, contrôlez le projet et collaborez en toute
                simplicité.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Répertoires des parties prenantes</li>
                <li>Stockage des information des sites</li>
                <li>Gestion des tâches</li>
                <li>Suivre les activities de chaque site</li>
                <li>Suivre le statut de réglement des devis</li>
                <li>Notifications automatisées</li>
                <li>S&apos;assurer que le projet est sur les rails</li>
                <li>Rapports et analyses avancés pour prendre les bonnes decisions</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full lg:w-1/2">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="m@example.com"
                        type="email"
                        value={email}
                        required
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-6" type="submit" onClick={handleSignIn}>
                    Sign In
                  </Button>
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
                </form>
                <div className="mt-4 text-center">
                  <Button onClick={() => setShowResetForm(!showResetForm)} variant="link">
                    Forgot Password?
                  </Button>
                </div>
                {showResetForm && (
                  <form onSubmit={handleResetPassword} className="mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Enter your email</Label>
                      <Input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={e => setResetEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button className="w-full mt-4" type="submit">
                      Reset Password
                    </Button>
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
                  </form>
                )}
              </TabsContent>
              <TabsContent value="signup">
                <form>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="signup-name"
                        placeholder="John Doe"
                        required
                        value={FullName}
                        onChange={e => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="signup-email"
                        placeholder="m@example.com"
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-6" type="submit" onClick={handleSignUp}>
                    Sign Up
                  </Button>
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
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our{' '}
              <a href="#" className="font-medium text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
