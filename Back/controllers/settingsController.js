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
//update User Account informations
const updateUserAccount = async (req, res) => {
    // Log the userId from req.user to verify it's populated
    const userId = req.user?.id;
    // Return an error if userId is missing
    if (!userId) {
        return res.status(400).json({ error: "User ID is missing in the request." });
    }
    // Extract userData from request body
    const userData = req.body;
    // Call the updateUser function from the model, passing userId and userData
    const result = await settingsModel.updateUser(userId, userData);
    // Check for success and send an appropriate response
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    // Respond with a success message
    res.status(200).json({ message: "User account updated successfully." });
};
// 3. List All Users
const listUsers = async (req, res) => {
    const result = await settingsModel.listUsers();
    
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
    updateUserAccount,
};
export default settingsController;