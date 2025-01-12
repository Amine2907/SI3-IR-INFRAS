/**
 * AuthPage component.
 *
 * This component renders a page for logging in, signing up, and resetting passwords.
 * It uses the AuthService to handle the authentication, and the useAuth hook to
 * get the login function.
 *
 * @returns {React.ReactElement} The AuthPage component.
 */
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
import AuthService from 'services/authService';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
<<<<<<< HEAD
=======
import AuthService from 'services/Auth/authService';
>>>>>>> 51345e251cfd8a0cc2445baf7bdee27328722086
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'context/Auth/AuthContext';
import { Alert, AlertDescription } from 'components/ui/alert';

export default function AuthPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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

  // HANDLE SIGN IN
  const handleSignIn = async e => {
    e.preventDefault(); // Prevent the default form submission
    // Call the signIn function from your AuthService
    const response = await AuthService.signIn(email, password);
    // Check if response has an error
    if (response.success === false) {
      setError('Identifiants invalides, veuillez réessayer.');
    } else {
      console.log('Connexion réussie :', response);
      const { user, accessToken } = response; // Adjust according to your response structure
      if (accessToken) {
        login(user, accessToken);
        localStorage.setItem('token', accessToken);
        navigate('/dashboard');
      } else {
        console.error('Access token not found in response:', response);
        setError("Token d'accès manquant.");
      }
    }
  };

  // HANDLE SIGN UP
  const handleSignUp = async e => {
    e.preventDefault();
    try {
      const response = await AuthService.signUp(firstName, lastName, email, password);
      if (response && response.success) {
        setMessage('Inscription réussie ! Veuillez vérifier votre e-mail.');
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
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

  // HANDLE RESET PASSWORD
  const handleResetPassword = async e => {
    e.preventDefault();
    try {
      const response = await AuthService.resetPassword(resetEmail);
      if (response && response.success) {
        setMessage('Un e-mail de réinitialisation a été envoyé.');
        setResetEmail('');
        setShowResetForm(false); // Hide reset form after successful submission
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
                <li>Stockage des informations des sites</li>
                <li>Gestion des tâches</li>
                <li>Suivre les activités de chaque site</li>
                <li>Suivre le statut de règlement des devis</li>
                <li>Notifications automatisées</li>
                <li>S&apos;assurer que le projet est sur les rails</li>
                <li>Rapports et analyses avancés pour prendre les bonnes décisions</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full lg:w-1/2">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Bienvenue</CardTitle>
            <CardDescription className="text-center">
              Connectez-vous à votre compte ou créez-en un nouveau
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Se connecter</TabsTrigger>
                <TabsTrigger value="signup">S&apos;inscrire</TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin">
                {!showResetForm ? (
                  <form onSubmit={handleSignIn}>
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
                        <Label htmlFor="password">Mot de passe</Label>
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
                    <Button className="w-full mt-6" type="submit">
                      Se connecter
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
                ) : (
                  <form onSubmit={handleResetPassword} className="mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Entrez votre email</Label>
                      <Input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={e => setResetEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button className="w-full mt-4" type="submit">
                      Réinitialiser le mot de passe
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
                    <div className="mt-4 text-center">
                      <Button onClick={() => setShowResetForm(false)} variant="link">
                        Retour à la connexion
                      </Button>
                    </div>
                  </form>
                )}
                <div className="mt-4 text-center">
                  {!showResetForm && (
                    <Button onClick={() => setShowResetForm(true)} variant="link">
                      Oublier mot de passe ?
                    </Button>
                  )}
                </div>
              </TabsContent>
              {/* Sign Up Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Votre prénom"
                        value={firstName}
                        required
                        onChange={e => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Votre nom"
                        value={lastName}
                        required
                        onChange={e => setLastName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        required
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          required
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
                  <Button className="w-full mt-6" type="submit">
                    S&apos;inscrire
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
          <CardFooter>
            <div className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} IR INFRAS. Tous droits réservés.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
