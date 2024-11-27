/**
 * This file contains the model for the companys feature.
 * It provides functions to interact with the supabase instance.
 * The functions are:
 * - createcompany: creates a company in the database
 * - getAllcompanys: gets all the companys in the database
 * - getcompanyById: gets a company by its ID
 * - updatecompany: updates a company in the database
 * - deactivatecompany: deactivates a company in the database
 * - activatecompany: activates a company in the database
 * - searchcompanys: searches companys in the database
 * - getActivecompanys: gets all the active companys in the database
 * - getInactivecompanys: gets all the inactive companys in the database
 */
import { supabase } from "../../config/supabaseClient.js";
//Create company 
const createcompany = async (data) => {
    try {
        const { data: result, error } = await supabase
            .from('Entreprise')
            .insert([data]);
        if (error) {
            throw error;
        }
        return { success: true, result };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
//GetAllcompanys 
const getAllcompanys = async() => {
    try {
        const {data,error} = await supabase
        .from('Entreprise')
        .select('*');

        if(error){
            throw error;
        }
        return {success:true , data};
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
const getAllActivecompanys = async() => {
    try {
        const {data,error} = await supabase
        .from('Entreprise')
        .select('*')
        .eq('is_active',true);

        if(error){
            throw error;
        }
        return {success:true , data};
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
const getAllInactivecompanys = async() => {
    try {
        const {data,error} = await supabase
        .from('Entreprise')
        .select('*')
        .eq('is_active',false);

        if(error){
            throw error;
        }
        return {success:true , data};
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
//GetcompanysById 
const GetcompanysById = async(ENTid) => {
    try {
        const {data,error} = await supabase
        .from('Entreprise')
        .select('*')
        .eq('ENTid',ENTid);
        if(error){
            throw error ;
        }
        return {success:true , data };
    }catch(error){
        return {success:false ,error:error.messsage};
    }
};
//Update companys 
const updatecompany = async (ENTid, updates) => {
    try {
      const { data, error } = await supabase
        .from('Entreprise') // Make sure the table name is correct
        .update(updates)
        .eq('ENTid', ENTid);
      if (error) {
        console.error('Supabase Error:', error); // Log the error
        return { success: false, error: error.message }; // Pass the actual error message
      }
      return { success: true, data }; // Return success with data
    } catch (err) {
      console.error('Catch Block Error:', err); // Log any unexpected errors
      return { success: false, error: err.message }; // Return the caught error message
    }
  };
// Activate companys 
const activatecompany = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Entreprise')
        .update({is_active:true})
        .eq('ENTid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
const desactivatecompany = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Entreprise')
        .update({is_active:false})
        .eq('ENTid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
const companiesModel = {
    createcompany,
    getAllcompanys,
    GetcompanysById,
    updatecompany,
    activatecompany,
    desactivatecompany,
    getAllActivecompanys,
    getAllInactivecompanys,
}
export default companiesModel ; 