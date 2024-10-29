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
import { supabase } from "../config/supabaseClient.js";
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
///////////////////////////////////////////////////////////////////////////////
// 2. Update Password
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // Assuming you have middleware that sets the user
  try {
    // Verify current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: req.user.email,
      password: currentPassword,
    });
    if (signInError) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }
    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (updateError) {
      throw updateError;
    }
    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'An error occurred while changing the password.' });
  };
};
// //////////////////////////////////////////////////////////////////////////////////////
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
// in this version of code im going to only lit the user that is connected to the account , otherwise im going to list all the users for the admin or the company admin when changing this web application to SAAS 
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