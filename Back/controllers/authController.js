/**
 * @author: Mohamed Amine EL BAH 
 * This file contains functions for user authentication
 * - `signUp`: signs up the user and returns the user if successful
 * - `signIn`: signs in the user and returns the user if successful
 * - `resetPassword`: resets the user's password and returns a success message if successful
 * - `confirmResetPassword`: confirms a user's password reset and returns a success message if successful
 * - `signOut`: signs out the user and removes the user from the session
 * @module authController
 */
import { supabase } from "../config/supabaseClient.js";
import { configDotenv } from "dotenv";
configDotenv();
const FRONT_URL= process.env.FrontUrl;
export const signUp = async (req, res) => {
  const {firstName,lastName,email, password} = req.body;
  console.log(req.body);
  const EmailConfirmURL = `${FRONT_URL}/auth/confirm-sign-up`
    if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, error: 'Tous les champs sont obligatoires.' });
  }
  try {
    const { user, error } = await supabase.auth.signUp({ email, password , options: {
      data: {
        firstName,
        lastName,
        emailRedirectTo: EmailConfirmURL,
      },
    },});
    if (error) {
      console.error('Error during sign-up:', error.message);  // Log the error message
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, message: 'User signed up successfully!', user }); 
  } catch (err) {
    console.error('Server error:', err);  // Catch unexpected errors
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
//Sign in Controller
export const signIn = async (req, res) => {
  const { email, password } = req.body; 
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('Supabase Sign-in Error:', error.message); // Log the error message
    return res.status(400).json({ error: error.message });
  }
  return res.status(200).json({ message: 'Sign in successful', user: data.user,accessToken: data.session.access_token, });
};
// Sign out Controller
export const signOut = async (req, res) => {
    const { error } = await supabase.auth.signOut(); 
    if (error) return res.status(400).json({ message: error.message });
    return res.status(200).json({ message: 'Sign out successfully!' });
};
// Function to initiate the password reset process
export const resetPassword = async (req, res) => {
  const { email } = req.body;

  // Validate email format
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address.' });
  }
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${FRONT_URL}/auth/confirm-reset-password` });
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, message: 'Password reset email sent successfully.' });
  } 
  catch (error) {
    console.error('Server error during password reset:', error);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};
// Function to confirm a password reset and to get the session to avoid AuthSessionExpiredError 
export const updatePassword = async (newPassword, accessToken) => {
  try {
    // Set the access token for this request
    supabase.auth.setSession(accessToken)

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error

    return { success: true, message: 'Password updated successfully' }
  } catch (error) {
    console.error('Error in updatePassword:', error.message)
    return { success: false, message: error.message }
  }
}
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}
