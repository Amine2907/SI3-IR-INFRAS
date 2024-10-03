// Node setup  
import express from "express" ; 
import cors from "cors"; 
import bodyParser from "body-parser";
// Supabase setup 
import { createClient } from "@supabase/supabase-js";
// Need to hide those credentiels
const supabaseUrl = 'https://zdejdubavwwcovzowzkr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZWpkdWJhdnd3Y292em93emtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc2ODIyMjYsImV4cCI6MjA0MzI1ODIyNn0.toFkiFtw0Ejz1eSbFO5Ht3cUutbU0wLgP67XH3M_QHc';
const supabase = createClient(supabaseUrl,supabaseKey); 
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