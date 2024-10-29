/**
 * This file contains functions for the settings feature
 * - `getAccountInfo`: gets the information of the current user
 * - `updatePassword`: updates the password of the current user
 * - `listUsers`: lists all the users in the database
 * - `listCompanies`: lists all the companies in the database
 * @module settingsModel
 */
import { supabase } from "../config/supabaseClient.js";

//Get Account informations 
const getAccountInfo = async(userId) => {
    try {
        const {data,error} = await supabase
        .from('ausers')
        .select('*')
        .eq('id',userId)
        .single();
        if(error){
            throw error ; 
        }
        return {success:true , data};
    }catch(error){
        return {success:false,error:error.message};
    }
};
// Update user account infromations
// only the admin or company admin can change the user is_active state and Role that case will be handled after in the application
const updateUser = async (userId, userData) => {
    if (!userId) {
        console.error("User ID is missing.");
        return { success: false, error: "User ID is required" };
    }
    // Destructure fields from userData, if they exist
    const { firstname, lastname, date_de_naissance, entreprise, department, genre, is_active } = userData || {};
    // Construct the data object dynamically
    const updateData = {
        ...(firstname !== undefined && { firstname }),
        ...(lastname !== undefined && { lastname }),
        ...(date_de_naissance !== undefined && { date_de_naissance }),
        ...(entreprise !== undefined && { entreprise }),
        ...(department !== undefined && { department }),
        ...(genre !== undefined && { genre }),
        ...(is_active !== undefined && { is_active }),
    };
    try {
        const { data, error } = await supabase
            .from('ausers')
            .update(updateData)
            .eq('id', userId);

        if (error) {
            throw error;
        }

        return { success: true, data };
    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, error: error.message };
    }
};
//////////////////////////////////////////////////////////////
// Update password 
// const updatePassword = async (userId, newPassword) => {
//     try {
//         // Update the user's password
//         const { error } = await supabase.auth.updateUser({
//             password: newPassword
//         });
//         // Check for errors
//         if (error) {
//             throw error; 
//         }
//         return { success: true };
//     } catch (error) {
//         // Return success status and error message if any
//         return { success: false, error: error.message };
//     }
// };
// List all users
// in this version of code im going to only lit the user that is connected to the account , otherwise im going to list all the users for the admin or the company admin when changing this web application to SAAS 
const listUsers = async() => {
    try {
        const{data,error} = await supabase 
        .from('ausers')
        .select('*');
        
        if(error){
            throw error ;
        }
        return {success:true , data };
    }catch(error){
        return {success:false,error:error.message};
    }
};
const settingsModel = {
    getAccountInfo,
    // updatePassword,
    listUsers,
    updateUser,
    // verifyCurrentPassword,
}
export default settingsModel; 