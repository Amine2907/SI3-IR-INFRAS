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
//update Account informations 
// const updateUser = async (req,res) => {
//     const userId = req.user?.id;
//     const userData = { firstname, lastname, date_de_naissance, entreprise, department, genre, is_active } = req.body;
//     try {
//         const {data,error} = await supabase
//         .from('ausers')
//         .update(userData)
//         .eq('id',userId)
//         .single();
//         if(error){  
//             throw error ;   
//         }
//         return {success:true , data};           
//     }catch(error){
//         return {success:false,error:error.message};
//     }
// };
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
// Update password 
const updatePassword = async(userId,newPassword) =>{
    try {
        const{error} = await supabase.auth.updateUser({id:userId,password:newPassword});
        if(error){
            throw error ; 
        }
        return {success:true};
    }catch(error){
        return {success:false ,error:error.message};
    };
};
// Get current password 
const getCurrentPassword = async(userId) => {
    try {
        const{data,error} = await supabase
        .from('ausers')
        .select('password')
        .eq('id',userId)
        .single();
        if(error){
            throw error ;
        }
        return {success:true ,data : data.password };
    }catch(error){
        return {success:false,error:error.message};
    }
};
// List all users 
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
    getCurrentPassword,
    updatePassword,
    listUsers,
    updateUser,
}
export default settingsModel; 