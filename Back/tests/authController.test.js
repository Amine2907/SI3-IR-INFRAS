import request from 'supertest';
import { supabase } from '../../Config/supabaseClient.js';
const express = require('express');
const app = express();

describe('Auth Controller Tests', () => {
    const testUser = {
        email: 'testuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
    };

    beforeAll(async () => {
        // Cleanup: Remove test user if it already exists (optional)
        const { data, error } = await supabase
            .from('auth.users') // Adjust this to the correct users table
            .select('*')
            .eq('email', testUser.email);

        if (data && data.length > 0) {
            await supabase.from('auth.users').delete().eq('email', testUser.email);
        }
    });

    test('User Sign Up', async () => {
        const response = await request(app)
            .post('/api/auth/signup') // Adjust the route as needed
            .send(testUser);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.user).toHaveProperty('id');
    });

    test('User Sign In', async () => {
        const response = await request(app)
            .post('/api/auth/signin') // Adjust the route as needed
            .send({ email: testUser.email, password: testUser.password });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Sign in successful');
        expect(response.body.user).toHaveProperty('id');
    });

    test('User Sign Out', async () => {
        const response = await request(app)
            .post('/api/auth/signout') // Adjust the route as needed
            .send();

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Sign out successfully!');
    });

    test('Reset Password', async () => {
        const response = await request(app)
            .post('/api/auth/reset-password') // Adjust the route as needed
            .send({ email: testUser.email });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Password reset email sent successfully.');
    });

    test('Confirm Reset Password', async () => {
        // This requires a valid access token; 
        // you may need to adjust this test based on how you're managing tokens.
        const validToken = 'your-valid-access-token'; // Replace with a valid token for testing
        const newPassword = 'newPassword123';

        const response = await request(app)
            .post(`/api/auth/confirm-reset-password?access_token=${validToken}`) // Adjust the route as needed
            .send({ newPassword });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Password reset successfully.');
    });

    afterAll(async () => {
        // Cleanup: Remove test user if created during tests
        const { data, error } = await supabase
            .from('auth.users') // Adjust this to the correct users table
            .select('*')
            .eq('email', testUser.email);

        if (data && data.length > 0) {
            await supabase.from('auth.users').delete().eq('email', testUser.email);
        }
    });
});
