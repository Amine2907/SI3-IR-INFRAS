import { supabase } from './config/supabaseClient.js'; 

// Sign up Controller
export const signUp = async (req, res) => {
    const { email, password } = req.body; 
    const { data, error } = await supabase.auth.signUp({ email, password }); 
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ message: 'Sign up successful, please check your email!' });
};

// Sign in Controller
export const signIn = async (req, res) => {
    const { email, password } = req.body; 
    const { data, error } = await supabase.auth.signInWithPassword({ email, password }); 
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ message: 'Sign in successful', user: data.user });
};

// Sign out Controller
export const signOut = async (req, res) => {
    const { error } = await supabase.auth.signOut(); 
    if (error) return res.status(400).json({ message: error.message });
    return res.status(200).json({ message: 'Sign out successfully!' });
};