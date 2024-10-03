// Node setup  
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 
// Supabase setup 
// const createClient = require ('@supabase/supabase-js'); 
import { createClient } from "@supabase/supabase-js";  
const supabase = createClient(process.env.REACT_APP_SUPABASE_URL,process.env.REACT_APP_SUPABSE_ANON_KEY); 
const app = express()
app.use(cors({
    origin: 'http://localhost:3000',}));
app.use(bodyParser.json());
// Sign up Route 
app.post('/api/signup', async (req,res)=> {
    const {email, password } = req.body; 
    const {data , error } = await supabase.auth.signUp({email,password}); 
    if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ message: 'Sign up successful, please check your email!' }); 
}); 
// Sign in Route
app.post('api/signin', async (req,res)=> {
const {email,password} = req.body ; 
const {data,error} = await supabase.auth.signInWithPassword({email,password}); 
if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ message: 'Sign in successful', user: data.user }); 
});
// Sign out Route 
app.post('api/signout', async (req,res) => {
const {error} = await supabase.auth.signOut(); 
if (error) return res.status(400).json({message : error.message }); 
return res.status(200).json({message : 'Sign out succefully ! '}); 
});
app.listen(5000,()=>{
console.log('Backend running on http://localhost:5000'); 
});