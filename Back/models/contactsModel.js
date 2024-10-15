import { supabase } from "../Config/supabaseClient.js";
//Create Contact 
const createContact = async (data) => {
    try {
        const user = supabase.auth.user(); 
        if (!user) {
            throw new Error('User is not logged in');
        }
        const contactData = { ...data, user_id: user.id };
        const { data: result, error } = await supabase
            .from('Contacts')
            .insert([contactData]);
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
//GetContactsById 
const GetContactsById = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Contacts')
        .select('*')
        .eq('Cid',id)
        .eq('is_active',true);
        if(error){
            throw error ;
        }
        return {success:true , data };
    }catch(error){
        return {success:false ,error:error.messsage};
    }
};
//Update Contacts 
const updateContact = async(id,updates) => {
    try {
        const {data,error} = await supabase
        .from('Conatcts')
        .update(updates)
        .eq('Cid',id)
        .eq('is_active',true);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
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
            .select('*')
            .eq('is_active', true);

        if (filters.nom) {
            query = query.ilike('Nom', `%${filters.nom}%`);
        }
        if (filters.prenom) {
            query = query.ilike('Prenom', `%${filters.prenom}%`);
        }
        if (filters.email) {
            query = query.ilike('Email', `%${filters.email}%`);
        }
        if (filters.mission) {
            query = query.ilike('Email', `%${filters.mission}%`);
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
}
export default contactsModel ; 