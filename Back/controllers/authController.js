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
  const redirectToUrl = `${FRONT_URL}/auth/confirm-reset-password`;
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
// export const confirmResetPassword = async (req, res) => {
//   const { token, newPassword } = req.body;
//   // Validate input
//   if (!token || !newPassword) {
//     return res.status(400).json({ success: false, error: 'Token and new password are required.' });
//   }
//   // Set the access token
//   supabase.auth.setAuth(token); // This sets the session for Supabase with the provided token
//   try {
//     // Update the user's password
//     const { data, error } = await supabase.auth.updateUser({ password: newPassword });

//     if (error) {
//       return res.status(400).json({ success: false, error: error.message });
//     }

//     return res.status(200).json({ success: true, message: 'Password reset successfully.' });
//   } catch (error) {
//     return res.status(500).json({ success: false, error: 'Server error' });
//   }
// };
//////////////////////////////////////////////////////////////////////////////////////////////////
export const confirmResetPassword = async (req, res) => {
  const {newPassword } = req.body;
  if (!newPassword) {
    return res.status(400).json({ success: false, error: 'Un nouveau mot de passe est requis.' });
  }
  try {
    // Call the Supabase API directly to reset the password
    const { data, error } = await supabase.auth.api.updateUser( {password: newPassword });
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, message: 'Réinitialisation du mot de passe réussie.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Erreur du serveur.' });
  }
};
// export const confirmUser = async (req, res) => {
//   const { token_hash, type, next } = req.body;
//   if (token_hash && type) {
//     const supabase = createClient({ req, res });
//     const { error } = await supabase.auth.verifyOtp({
//       type,
//       token_hash,
//     });
//     if (!error) {
//       return res.redirect(303, `/${next.slice(1)}`);
//     }
//   }
//   res.redirect(303, '/auth/auth-code-error');
// };