import request from 'supertest';
import { supabase } from '../Config/supabaseClient';
const express = require('express');
const app = express();

describe('Entity Model Tests', () => {
    let testEntityId;

    // Test data for creating a new entity
    const testEntity = {
        nom: 'Test Entity',
        ville: 'Test City',
        region: 'Test Region',
        code_postal: '12345',
        role: 'Test Role',
        is_active: true
    };

    afterAll(async () => {
        // Clean up: Deactivate the test entity after tests
        if (testEntityId) {
            await supabase.from('Entite').update({ is_active: false }).eq('Eid', testEntityId);
        }
    });

    test('Create an entity', async () => {
        const response = await request(app)
            .post('/api/entities') // Adjust the route as needed
            .send(testEntity);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.result).toHaveProperty('Eid');
        testEntityId = response.body.result[0].Eid; // Save the entity ID for later tests
    });

    test('Get all active entities', async () => {
        const response = await request(app).get('/api/entities'); // Adjust the route as needed

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('Get entity by ID', async () => {
        const response = await request(app)
            .get(`/api/entities/${testEntityId}`) // Adjust the route as needed
            .send();

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('Eid', testEntityId);
    });

    test('Update an entity', async () => {
        const updates = { nom: 'Updated Entity' };

        const response = await request(app)
            .put(`/api/entities/${testEntityId}`) // Adjust the route as needed
            .send(updates);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('Eid', testEntityId);
    });

    test('Deactivate an entity', async () => {
        const response = await request(app)
            .patch(`/api/entities/${testEntityId}/deactivate`) // Adjust the route as needed
            .send();

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test('Activate an entity', async () => {
        const response = await request(app)
            .patch(`/api/entities/${testEntityId}/activate`) // Adjust the route as needed
            .send();

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test('Search entities by filters', async () => {
        const filters = { nom: 'Test' }; // Adjust filters as needed

        const response = await request(app)
            .get('/api/entities/search') // Adjust the route as needed
            .query(filters);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });
});
