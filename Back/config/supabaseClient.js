import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv'; 
dotenv.config();
const supabaseUrl = process.env.DataBaseUrl || 'your-supabase-url';
const supabaseKey = process.env.DataBaseKey || 'your-supabase-key';
export const supabase = createClient(supabaseUrl, supabaseKey);