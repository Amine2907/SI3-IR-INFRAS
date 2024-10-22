import request from 'supertest';
import { supabase } from '../Config/supabaseClient';
const express = require('express');
const app = express();

describe('Contacts Model Tests', () => {
    let testContactId;

    // Test data for creating a new contact
    const testContact = {
        Nom: 'Test Contact',
        Prenom: 'John',
        Mission: 'Testing',
        is_active: true
    };

    afterAll(async () => {
        // Clean up: Deactivate the test contact after tests
        if (testContactId) {
            await supabase.from('Contacts').update({ is_active: false }).eq('Cid', testContactId);
        }
    });

    test('Create a contact', async () => {
        const response = await request(app)
            .post('/api/contacts') // Adjust the route as needed
            .send(testContact);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.result).toHaveProperty('Cid');
        testContactId = response.body.result[0].Cid; // Save the contact ID for later tests
    });

    test('Get all contacts', async () => {
        const response = await request(app).get('/api/contacts'); // Adjust the route as needed

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('Get contact by ID', async () => {
        const response = await request(app)
            .get(`/api/contacts/${testContactId}`) // Adjust the route as needed
            .send();

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('Cid', testContactId);
    });

    test('Update a contact', async () => {
        const updates = { Nom: 'Updated Contact' };

        const response = await request(app)
            .put(`/api/contacts/${testContactId}`) // Adjust the route as needed
            .send(updates);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('Cid', testContactId);
    });

    test('Deactivate a contact', async () => {
        const response = await request(app)
            .patch(`/api/contacts/${testContactId}/deactivate`) // Adjust the route as needed
            .send();

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test('Activate a contact', async () => {
        const response = await request(app)
            .patch(`/api/contacts/${testContactId}/activate`) // Adjust the route as needed
            .send();

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test('Search contacts by filters', async () => {
        const filters = { nom: 'Test' }; // Adjust filters as needed

        const response = await request(app)
            .get('/api/contacts/search') // Adjust the route as needed
            .query(filters);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });
});
