/**
 * @author: Mohamed Amine EL BAH 
 * Ce fichier contient des fonctions pour l"'authentification des utilisateurs
 * - `signUp` : inscrit l'utilisateur et retourne l"utilisateur en cas de succès
 * - `signIn` : connecte l"'utilisateur et retourne l'utilisateur en cas de succès
 * - `resetPassword` : réinitialise le mot de passe de l"utilisateur et retourne un message de succès en cas de réussite
 * - `confirmResetPassword` : confirme la réinitialisation du mot de passe et retourne un message de succès
 * - `signOut` : déconnecte l"'utilisateur et supprime l'utilisateur de la session
 * @module authController
 */
import { supabase } from "../../config/supabaseClient.js";
import { configDotenv } from "dotenv";
configDotenv();
const FRONT_URL = process.env.FrontUrl;

export const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const EmailConfirmURL = `${FRONT_URL}/auth/confirm-sign-up`;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, error: "Tous les champs sont obligatoires." });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          emailRedirectTo: EmailConfirmURL,
        },
      },
    });
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    if (!data || !data.user) {
      return res.status(400).json({ success: false, error: "Échec de la récupération des données utilisateur après l'inscription." });
    }
    const user = data.user;
    const { firstName: metaFirstName, lastName: metaLastName } = user.user_metadata || {};
    const { error: insertError } = await supabase
      .from('ausers')
      .insert([
        {
          id: user.id,
          email: user.email,
          firstName: metaFirstName || firstName,
          lastName: metaLastName || lastName,
          created_at: new Date().toISOString(),
          is_active: true,
        },
      ]);
    if (insertError) {
      console.error("Erreur lors de l'insertion de l'utilisateur dans la table ausers :", insertError.message);
      return res.status(400).json({ success: false, error: "Échec de l'enregistrement des données utilisateur." });
    }
    return res.status(200).json({ success: true, message: 'Utilisateur inscrit avec succès !', user });
  } catch (err) {
    console.error('Erreur serveur :', err);
    return res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body; 
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(200).json({ message: 'Connexion réussie', user: data.user, accessToken: data.session.access_token });
};

export const signOut = async (req, res) => {
  const { error } = await supabase.auth.signOut(); 
  if (error) return res.status(400).json({ message: error.message });
  return res.status(200).json({ message: 'Déconnexion réussie !' });
};

export const resetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, error: 'Adresse e-mail invalide.' });
  }
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${FRONT_URL}/auth/confirm-reset-password` });
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, message: 'E-mail de réinitialisation du mot de passe envoyé avec succès.' });
  } catch (error) {
    console.error('Erreur serveur lors de la réinitialisation du mot de passe :', error);
    return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
  }
};

export const handleUpdatePassword = async (req, res) => {
  const { newPassword, accessToken, refresh_token } = req.body;
  
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' });
  }
  try {
    const { error: sessionError } = await supabase.auth.setSession({ access_token: accessToken, refresh_token });
    if (sessionError) {
      console.error('Erreur de session :', sessionError.message);
      return res.status(401).json({ success: false, error: "Jeton d'accès invalide." });
    }
    const { data, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Erreur lors de la récupération de l'utilisateur :", userError.message);
      return res.status(401).json({ success: false, error: userError.message });
    }
    if (!data.user) {
      return res.status(401).json({ success: false, error: "Jeton d'accès invalide." });
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      console.error('Erreur de mise à jour :', error);
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur interne du serveur :', error);
    return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
  }
};

export const logUserOut = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erreur lors de la déconnexion :', error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, message: 'Utilisateur déconnecté avec succès' });
  } catch (err) {
    console.error('Erreur inattendue lors de la déconnexion :', err.message);
    return res.status(500).json({ success: false, error: "Une erreur inattendue s'est produite" });
  }
};
