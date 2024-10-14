import { supabase } from "../Config/supabaseClient.js";
import { configDotenv } from "dotenv";
configDotenv();
const FRONT_URL= process.env.FrontUrl;
export const signUp = async (req, res) => {
  const { email, password,firstName , lastName } = req.body;
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
    // If no error, respond with success
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
  return res.status(200).json({ message: 'Sign in successful', user: data.user });
};
// Sign out Controller
export const signOut = async (req, res) => {
    const { error } = await supabase.auth.signOut(); 
    if (error) return res.status(400).json({ message: error.message });
    return res.status(200).json({ message: 'Sign out successfully!' });
};
// // Reset Pwd Controller 
export const resetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address.' });
  }
  const redirectToUrl = `${FRONT_URL}/auth/confirm-reset-password`;
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectToUrl });
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, message: 'Password reset email sent successfully.' }); 
  } catch (error) {
    console.error('Server error during password reset:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
// Confirm Reset Password for the user
export const confirmResetPassword = async (req, res) => {
  const { newPassword } = req.body; // New password from the request body
  const { token } = req.query; // Token from the query string
  // Validate that both token and new password are provided
  if (!newPassword || !token) {
    return res.status(400).json({ success: false, error: 'New password and token are required.' });
  }
  try {
    // Step 1: Authenticate the user using the token
    const { error: sessionError } = await supabase.auth.setSession(token);
    if (sessionError) {
      return res.status(400).json({ success: false, error: 'Invalid or expired token.' });
    }
    // Step 2: Update the user's password after successful authentication
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    // Respond with success if password update is successful
    return res.status(200).json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
};