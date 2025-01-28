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
import { supabase } from "../../config/supabaseClient.js";
import { configDotenv } from "dotenv";
configDotenv();
const FRONT_URL= process.env.FrontUrl;
export const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log(req.body);

  const EmailConfirmURL = `${FRONT_URL}/auth/confirm-sign-up`;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, error: 'Tous les champs sont obligatoires.' });
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

    console.log('Supabase signUp response:', { data, error });

    if (error) {
      console.error('Error during sign-up:', error.message);
      return res.status(400).json({ success: false, error: error.message });
    }

    if (!data || !data.user) {
      return res.status(400).json({ success: false, error: 'Failed to retrieve user data after sign-up.' });
    }

    const user = data.user;

    // Extract data from user_metadata
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
      console.error('Error inserting user into ausers table:', insertError.message);
      return res.status(400).json({ success: false, error: 'Failed to save user data.' });
    }
    return res.status(200).json({ success: true, message: 'User signed up successfully!', user });
  } catch (err) {
    console.error('Server error:', err);
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
// handle update the password 
export const handleUpdatePassword = async (req, res) => {
  const { newPassword, accessToken ,  refresh_token} = req.body;
  // console.log('Received data:', { newPassword, accessToken,refresh_token }); // Log input data for debugging
  // Validate the new password
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
  }
  try {
    // console.log('Attempting to set session with access token:', accessToken)
    const { error: sessionError } = await supabase.auth.setSession({ access_token: accessToken , refresh_token: refresh_token  });
    
    if (sessionError) {
      console.error('Session error:', sessionError.message);
      return res.status(401).json({ success: false, error: 'Invalid access token.' });
    }
    // Use the access token to get the user
    const { data, error: userError } = await supabase.auth.getUser();
    // Check for user retrieval errors
    if (userError) {
      console.error('Error getting user:', userError.message);
      return res.status(401).json({ success: false, error: userError.message });
    }
    // Ensure a user is returned
    if (!data.user) {
      return res.status(401).json({ success: false, error: 'Invalid access token.' });
    }
    // Update the user’s password
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    // Check for update errors
    if (error) {
      console.error('Update error:', error);
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};
export const logUserOut = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      // Log and return an error response if the logout fails
      console.error('Error logging out:', error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, message: 'User logged out successfully' });
  } catch (err) {
    console.error('Unexpected error during logout:', err.message);
    return res.status(500).json({ success: false, error: 'An unexpected error occurred' });
  }
};
