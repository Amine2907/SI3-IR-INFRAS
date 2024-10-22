import { supabase } from "../Config/supabaseClient";
const express = require('express');
const app = express();

describe('Supabase Client', () => {
    test('should create a Supabase client with valid environment variables', () => {
        expect(supabase).toBeDefined();
        expect(supabase).toHaveProperty('auth');
        expect(supabase).toHaveProperty('from');
        expect(supabase).toHaveProperty('rpc');
    });

    test('should use correct Supabase URL and Key', () => {
        const supabaseUrl = process.env.DataBaseUrl || 'your-supabase-url';
        const supabaseKey = process.env.DataBaseKey || 'your-supabase-key';

        expect(supabaseUrl).not.toBe('your-supabase-url');
        expect(supabaseKey).not.toBe('your-supabase-key');
    });
});
