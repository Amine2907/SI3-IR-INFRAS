/**
 ** @author: Mohamed Amine EL BAH 
 * This file contains the controller for the settings feature.
 * It provides functions to interact with the model for settings.
 * The functions include:
 * - getAccountInfo: gets the information of the current user
 * - updatePassword: updates the password of the current user
 * - listUsers: lists all the users in the database
 * - listCompanies: lists all the companies in the database
 * @module settingsController
 */
import settingsModel from "../models/settingsModel.js";

// 1. Get Account Information
const getAccountInfo = async (req, res) => {
    const userId = req.user.id;
    const result = await settingsModel.getAccountInfo(userId);
    
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    
    res.status(200).json(result.data);
};
// 2. Update Password
const updatePassword = async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    // Step 1: Verify the current password
    const currentPasswordCheck = await settingsModel.getCurrentPassword(userId);
    if (!currentPasswordCheck.success) {
        return res.status(400).json({ error: currentPasswordCheck.error });
    }
    if (currentPasswordCheck.data !== currentPassword) {
        return res.status(400).json({ error: "Current password is incorrect." });
    }
    // Step 2: Update to the new password
    const result = await settingsModel.updatePassword(userId, newPassword);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.status(200).json({ message: "Password updated successfully." });
};
// 3. List All Users
const listUsers = async (req, res) => {
    const result = await settingsModel.listUsers();
    
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    
    res.status(200).json(result.data);
};
// 4. List All Companies
const listCompanies = async (req, res) => {
    const result = await settingsModel.listCompanies();
    
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    
    res.status(200).json(result.data);
};
// Exporting the controller methods
const settingsController = {
    getAccountInfo,
    updatePassword,
    listUsers,
    listCompanies
};

export default settingsController;