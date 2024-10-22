import settingsModel from '../models/settingsModel';
import { supabase } from '../Config/supabaseClient';
jest.mock('../config/supabaseClient');
const express = require('express');
const app = express();

describe('Settings Model', () => {
    const userId = 'test-user-id'; // Example user ID for testing
    const newPassword = 'new-password';
    const mockUserData = { id: userId, email: 'test@example.com' }; // Example user data

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    test('getAccountInfo should return user info', async () => {
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnValueOnce({
                eq: jest.fn().mockReturnValueOnce({
                    single: jest.fn().mockResolvedValueOnce({ data: mockUserData, error: null })
                })
            })
        });

        const result = await settingsModel.getAccountInfo(userId);
        expect(result).toEqual({ success: true, data: mockUserData });
    });

    test('getAccountInfo should return an error if user not found', async () => {
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnValueOnce({
                eq: jest.fn().mockReturnValueOnce({
                    single: jest.fn().mockResolvedValueOnce({ data: null, error: { message: 'User not found' } })
                })
            })
        });

        const result = await settingsModel.getAccountInfo(userId);
        expect(result).toEqual({ success: false, error: 'User not found' });
    });

    test('updatePassword should update password successfully', async () => {
        supabase.auth.updateUser.mockResolvedValueOnce({ error: null });

        const result = await settingsModel.updatePassword(userId, newPassword);
        expect(result).toEqual({ success: true });
    });

    test('updatePassword should return an error if update fails', async () => {
        supabase.auth.updateUser.mockResolvedValueOnce({ error: { message: 'Failed to update password' } });

        const result = await settingsModel.updatePassword(userId, newPassword);
        expect(result).toEqual({ success: false, error: 'Failed to update password' });
    });

    test('getCurrentPassword should return current password', async () => {
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnValueOnce({
                eq: jest.fn().mockReturnValueOnce({
                    single: jest.fn().mockResolvedValueOnce({ data: { password: 'current-password' }, error: null })
                })
            })
        });

        const result = await settingsModel.getCurrentPassword(userId);
        expect(result).toEqual({ success: true, data: 'current-password' });
    });

    test('getCurrentPassword should return an error if user not found', async () => {
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnValueOnce({
                eq: jest.fn().mockReturnValueOnce({
                    single: jest.fn().mockResolvedValueOnce({ data: null, error: { message: 'User not found' } })
                })
            })
        });

        const result = await settingsModel.getCurrentPassword(userId);
        expect(result).toEqual({ success: false, error: 'User not found' });
    });

    test('listUsers should return a list of users', async () => {
        const mockUsers = [{ id: 'user1' }, { id: 'user2' }];
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockResolvedValueOnce({ data: mockUsers, error: null })
        });

        const result = await settingsModel.listUsers();
        expect(result).toEqual({ success: true, data: mockUsers });
    });

    test('listUsers should return an error if fetching fails', async () => {
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockResolvedValueOnce({ data: null, error: { message: 'Failed to fetch users' } })
        });

        const result = await settingsModel.listUsers();
        expect(result).toEqual({ success: false, error: 'Failed to fetch users' });
    });

    test('listCompanies should return a list of companies', async () => {
        const mockCompanies = [{ nom: 'Company1' }, { nom: 'Company2' }];
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockResolvedValueOnce({ data: mockCompanies, error: null })
        });

        const result = await settingsModel.listCompanies();
        expect(result).toEqual({ success: true, data: mockCompanies });
    });

    test('listCompanies should return an error if fetching fails', async () => {
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockResolvedValueOnce({ data: null, error: { message: 'Failed to fetch companies' } })
        });

        const result = await settingsModel.listCompanies();
        expect(result).toEqual({ success: false, error: 'Failed to fetch companies' });
    });
});
