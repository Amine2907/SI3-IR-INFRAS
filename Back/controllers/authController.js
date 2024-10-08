import { supabase } from "../Config/supabaseClient.js";
const FRONT_URL = 'http://localhost:5000/api/auth';
// Sign up Controller
export const signUp = async (req, res) => {
    const { email, password } = req.body; 
    const { data, error } = await supabase.auth.signUp({ email, password }); 
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ message: 'Sign up successful, please check your email!' });
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
// Reset Pwd Controller 
export const resetPassword = async(req,res) => {
  const{email} = req.body ; 
  try {
    const {data,error} = await supabase.auth.resetPasswordForEmail(email,{redirectTo :`${FRONT_URL}/confirm-reset-password?token=YOUR_GENERATED_TOKEN`});
    if(error) {
    return res.status(400).json({success: false, error: error.message});
    }
    return res.status(200).json({ success: true, message: 'Password reset email sent successfully.' });
  } catch(error) {
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
// Confirm Reset Password for the user 
export const confirmResetPassword = async(req,res) => {
  const {token, newPassword} = req.body ; 
  try {
    const {data,error} = await supabase.auth.updateUser({password : newPassword} , {token});
    if (error){
      return res.status(400).json({success : false , error : error.message });
    }
    return res.status(200).json({success : true , messsage :'Mot de passe réinitialisé avec succès.' });
  } catch(error) {
    return res.status(500).json({ success: false, error: 'Erreur du serveur' });
  }
};
