// /**
//  * Page where users can sign up or sign in
//  *
//  * This page is accessed by people who are not logged in. It displays a form
//  * that allows them to either sign up or sign in. The form is toggled by a
//  * button that they can click.
//  *
//  * @returns {React.ReactElement} The rendered component
//  */
// NEW DESIGN I NEED TO IMPLEMNT FUNCTIONS FOR SIGNIN AND SIGNUP AND RESET PASSWORD AND CONFIRM RESET
'use client';
import React, { useState } from 'react';
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
import { useEffect } from 'react';
import { useAuth } from 'context/Auth/AuthContext';
export default function AuthPage() {
  const [FullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [resetEmail, setResetEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // const [showResetForm, setShowResetForm] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  useEffect(() => {
    // Clear messages after 10 seconds
    const timer = setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, 10000);

    return () => clearTimeout(timer); // Cleanup the timeout on component unmount
  }, [errorMessage, successMessage]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSignIn = async e => {
    e.preventDefault(); // Prevent the default form submission
    const response = await AuthService.signIn(email, password);
    // Check the response
    if (response.success === false) {
      setErrorMessage('Identifiants invalides, veuillez réessayer.');
    } else {
      console.log('Connexion réussie :', response);
      login();
      navigate('/dashboard');
    }
  };
  const handleSignUp = async e => {
    e.preventDefault();
    try {
      const response = await AuthService.signUp(FullName, email, password);
      if (response && response.success) {
        if (response.data && response.data.message) {
          setSuccessMessage(response.data.message);
          setEmail('');
          setPassword('');
          setFullName('');
        } else {
          setSuccessMessage('Inscription réussie ! Veuillez vérifier votre e-mail.');
        }
        setErrorMessage('');
      } else {
        setErrorMessage(response?.data?.message || "L'inscription a échoué. Veuillez réessayer.");
        setSuccessMessage('');
      }
    } catch (error) {
      console.error("Erreur d'inscription", error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Une erreur s'est produite lors de l'inscription. Veuillez réessayer."
      );
      setSuccessMessage('');
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
                <li>S&aposassurer que le projet est sur les rails</li>
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
                  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                  {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                </form>
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
                        requiredvalue={email}
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
                  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                  {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
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
