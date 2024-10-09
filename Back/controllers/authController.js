import { supabase } from "../Config/supabaseClient.js";
import dotenv from 'dotenv'; 
dotenv.config();
const FRONT_URL  = process.env.FrontUrl || 'your-FRONT-url';
// Sign up Controller
// export const signUp = async (req, res) => {
//   const { email, password } = req.body;
//   // if (!firstName || !lastName || !email || !password) {
//   //   return res.status(400).json({ success: false, error: 'All fields are required: firstName, lastName, email, and password.' });
//   // }
//   try {
//     const { user, error } = await supabase.auth.signUp({ email, password });
//     if (error) {
//       return res.status(400).json({ success: false, error: error.message });
//     }
//     // Optionally, you can store firstName and lastName in a users table if it's separate from auth
//     // Example: const result = await db.query('INSERT INTO users (id, firstName, lastName) VALUES ($1, $2, $3)', [user.id, firstName, lastName]);
//     return res.status(200).json({ success: true, message: 'User signed up successfully!', user });
//   } catch (error) {
//     return res.status(500).json({ success: false, error: 'Server error' });
//   }
// };
export const signUp = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Try to sign up the user with Supabase
    const { user, error } = await supabase.auth.signUp({ email, password });
    
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
// export const resetPassword = async(req,res) => {
//   const{email} = req.body ;
//   const redirectToUrl = `${FRONT_URL}/confirm-reset-password`;
//   try {
//     const {data,error} = await supabase.auth.resetPasswordForEmail(email,{redirectTo: redirectToUrl,});
//     if(error) {
//     return res.status(400).json({success: false, error: error.message});
//     }
//     return res.status(200).json({ success: true, message: 'Password reset email sent successfully.' });
//   } catch(error) {
//     return res.status(500).json({ success: false, error: 'Server error' });
//   }
// }
// // Confirm Reset Password for the user 
// export const confirmResetPassword = async(req,res) => {
//   const {token, newPassword} = req.body ; 
//   try {
//     const {data,error} = await supabase.auth.updateUser({password : newPassword} , {token});
//     if (error){
//       return res.status(400).json({success : false , error : error.message });
//     }
//     return res.status(200).json({success : true , messsage :'Mot de passe réinitialisé avec succès.' });
//   } catch(error) {
//     return res.status(500).json({ success: false, error: 'Erreur du serveur' });
//   }
// };
export const resetPassword = async (req, res) => {
  const { email } = req.body;
  // Validate email format (basic check)
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address.' });
  }
  const redirectToUrl = `${FRONT_URL}/confirm-reset-password`;
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectToUrl });
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, message: 'Password reset email sent successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
// Confirm Reset Password for the user
export const confirmResetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  // Validate input
  if (!token || !newPassword) {
    return res.status(400).json({ success: false, error: 'Token and new password are required.' });
  }
  try {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword }, { access_token: token });
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};