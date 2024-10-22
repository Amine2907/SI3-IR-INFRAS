/**
 * This file contains the model for the contacts feature.
 * It provides functions to interact with the supabase instance.
 * The functions are:
 * - createContact: creates a contact in the database
 * - getAllContacts: gets all the contacts in the database
 * - getContactById: gets a contact by its ID
 * - updateContact: updates a contact in the database
 * - deactivateContact: deactivates a contact in the database
 * - activateContact: activates a contact in the database
 * - searchContacts: searches contacts in the database
 * - getActiveContacts: gets all the active contacts in the database
 * - getInactiveContacts: gets all the inactive contacts in the database
 */
import { supabase } from "../Config/supabaseClient.js";
//Create Contact 
const createContact = async (data) => {
    try {
        const { data: result, error } = await supabase
            .from('Contacts')
            .insert([data]);
        if (error) {
            throw error;
        }
        return { success: true, result };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
//GetAllContacts 
const getAllContacts = async() => {
    try {
        const {data,error} = await supabase
        .from('Contacts')
        .select('*');

        if(error){
            throw error;
        }
        return {success:true , data};
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
const getAllActiveContacts = async() => {
    try {
        const {data,error} = await supabase
        .from('Contacts')
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
const getAllInactiveContacts = async() => {
    try {
        const {data,error} = await supabase
        .from('Contacts')
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
//GetContactsById 
const GetContactsById = async(Cid) => {
    try {
        const {data,error} = await supabase
        .from('Contacts')
        .select('*')
        .eq('Cid',Cid);
        if(error){
            throw error ;
        }
        return {success:true , data };
    }catch(error){
        return {success:false ,error:error.messsage};
    }
};
//Update Contacts 
const updateContact = async (Cid, updates) => {
    try {
      const { data, error } = await supabase
        .from('Contacts') // Make sure the table name is correct
        .update(updates)
        .eq('Cid', Cid);
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
// Activate Contacts 
const activateContact = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Contacts')
        .update({is_active:true})
        .eq('Cid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
const desactivateContact = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Contacts')
        .update({is_active:false})
        .eq('Cid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
const searchContacts = async(filters) => {
    try {
        let query = supabase
            .from('Contacts')
            .select('*');

        if (filters.nom) {
            query = query.ilike('Nom', `%${filters.nom}%`);
        }
        if (filters.prenom) {
            query = query.ilike('Prenom', `%${filters.prenom}%`);
        }
        if (filters.mission) {
            query = query.ilike('Mission', `%${filters.mission}%`);
        }
        const { data, error } = await query;
        if (error) {
            throw error;
        }
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
const contactsModel = {
    createContact,
    getAllContacts,
    GetContactsById,
    updateContact,
    activateContact,
    desactivateContact,
    searchContacts,
    getAllActiveContacts,
    getAllInactiveContacts,
}
export default contactsModel ; 