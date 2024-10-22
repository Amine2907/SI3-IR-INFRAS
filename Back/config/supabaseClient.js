/**
 * This file exports a supabase client that can be used by the entire application
 * The client is created using the createClient function from @supabase/supabase-js
 * The function takes two parameters, the first is the url of the database and the second is the key
 * The url and key are obtained from environment variables
 * The client is then exported and can be imported by other files
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv'; 
dotenv.config();
const supabaseUrl = process.env.DataBaseUrl || 'your-supabase-url';
const supabaseKey = process.env.DataBaseKey || 'your-supabase-key';
export const supabase = createClient(supabaseUrl, supabaseKey);