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
import { supabase } from "../../config/supabaseClient.js";
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
const getAllContacts = async () => {
    try {
        const { data, error } = await supabase
            .from('Contacts')
            .select('*')
            .order('prenom', { ascending: true, nullsFirst:false  })
            .order('nom', { ascending: true , nullsFirst:false  });
        if (error) {
            throw error;
        }
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
const getAllActiveContacts = async () => {
    try {
        // Fetch all active contacts without sorting
        const { data, error } = await supabase
            .from('Contacts')
            .select('*')
            .eq('is_active', true);
        if (error) {
            throw error;
        }
        // Manually sort the data
        const sortedData = data.sort((a, b) => {
            // Treat empty strings as null for sorting
            const prenomA = a.prenom === '' ? null : a.prenom;
            const prenomB = b.prenom === '' ? null : b.prenom;
            const nomA = a.nom === '' ? null : a.nom;
            const nomB = b.nom === '' ? null : b.nom;

            // Sort by prenom first
            if (prenomA === null && prenomB !== null) return 1;
            if (prenomA !== null && prenomB === null) return -1;
            if (prenomA < prenomB) return -1;
            if (prenomA > prenomB) return 1;

            // If prenom is equal, sort by nom
            if (nomA === null && nomB !== null) return 1; // a comes after b
            if (nomA !== null && nomB === null) return -1; // a comes before b
            if (nomA < nomB) return -1;
            if (nomA > nomB) return 1;
            // If both prenom and nom are equal, maintain original order
            return 0;
        });

        return { success: true, data: sortedData };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
const getAllInactiveContacts = async () => {
    try {
        // Fetch all active contacts without sorting
        const { data, error } = await supabase
            .from('Contacts')
            .select('*')
            .eq('is_active', false);

        if (error) {
            throw error;
        }
        // Manually sort the data
        const sortedData = data.sort((a, b) => {
            // Treat empty strings as null for sorting
            const prenomA = a.prenom === '' ? null : a.prenom;
            const prenomB = b.prenom === '' ? null : b.prenom;
            const nomA = a.nom === '' ? null : a.nom;
            const nomB = b.nom === '' ? null : b.nom;

            // Sort by prenom first
            if (prenomA === null && prenomB !== null) return 1;
            if (prenomA !== null && prenomB === null) return -1;
            if (prenomA < prenomB) return -1;
            if (prenomA > prenomB) return 1;

            // If prenom is equal, sort by nom
            if (nomA === null && nomB !== null) return 1; // a comes after b
            if (nomA !== null && nomB === null) return -1; // a comes before b
            if (nomA < nomB) return -1;
            if (nomA > nomB) return 1;
            // If both prenom and nom are equal, maintain original order
            return 0;
        });

        return { success: true, data: sortedData };
    } catch (error) {
        return { success: false, error: error.message };
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
        .from('Contacts')
        .update(updates)
        .eq('Cid', Cid);
      if (error) {
        console.error('Supabase Error:', error);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err) {
      console.error('Catch Block Error:', err);
      return { success: false, error: err.message };
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
    console.log("Received filters:", filters);
    try {
        let query = supabase
            .from('Contacts')
            .select('*');

        if (filters.nom) {
            query = query.ilike('nom', `%${filters.nom}%`);
        }
        if (filters.prenom) {
            query = query.ilike('prenom', `%${filters.prenom}%`);
        }
        if (filters.mission) {
            query = query.ilike('mission', `%${filters.mission}%`);
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