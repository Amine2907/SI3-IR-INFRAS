/**
 * This file contains the model for the entites feature.
 * It provides functions to interact with the database for entities.
 * The functions include:
 * - createEntite: creates a new entity in the database
 */
// CRU ENTITE AND ACTIVATING / DESACTIVATING INSTEAD OF DELETING 
import { supabase } from "../config/supabaseClient.js";
// Create Entite 
const createEntite = async(data) => {
    try {
        const {data: result , error } = await supabase
        .from('Entite')
        .insert([data]);
        if(error){
            throw error ; 
        }
        return {success: true , result};
    } catch(error){
        return {success:false , error:error.message};
    }
}; 
// Get all entites 
const getAllEntites = async() => {
try {
    const {data , error } = await supabase
    .from('Entite')
    .select('*');
    if (error) {
        throw error ; 
    } 
    return {success:true , data };
} catch(error) {
    return {success:false , error : error.message};
}
};
const getAllActiveEntites = async() => {
    try {
        const {data,error} = await supabase
        .from('Entite')
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
const getAllInactiveEntites = async() => {
    try {
        const {data,error} = await supabase
        .from('Entite')
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
// Get an entity by its EID 
const getEntityById = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Entite')
        .select('*')
        .eq('Eid',id);
        if(error){
            throw error;
        }
        return {success:true , data };
    } catch(error){
        return {success:false , error : error.message};
    }
};
// Update Entity 
const updateEntity = async(Eid,updates) => {
    try {
        const {data,error} = await supabase
        .from('Entite')
        .update(updates)
        .eq('Eid',Eid);
        if(error){
            throw error ; 
        }
        return {success : true , data };
    } catch (error) {
        return {success : false , error : error.message};
    }
};
// Desactivate an Entity 
const desactivateEntity = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Entite')
        .update({is_active:false})
        .eq('Eid',id);

        if(error){
            throw error 
        }
        return {success:true , data};
    } catch(error) {
        return {success:false , error : error.message };
    }
};
// Actvate an Entity 
const activateEntity = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Entite')
        .update({is_active:true})
        .eq('Eid',id);

        if(error){
            throw error 
        }
        return {success:true , data};
    } catch(error) {
        return {success:false , error : error.message };
    }
};
const searchEntites = async (filters) => {
    console.log("Received filters:", filters);
    try {
        let query = supabase
            .from('Entite')
            .select('*');   
        if (filters.nom) {
            query = query.ilike('nom', `%${filters.nom}%`);
        }
        if (filters.ville) {
            query = query.ilike('ville', `%${filters.ville}%`);
        }
        if (filters.region) {
            query = query.ilike('region', `%${filters.region}%`);
        }
        if (filters.code_postal) {
            query = query.eq('code_postal', filters.code_postal);
        }
        if (filters.role) {
            query = query.eq('role', filters.role);
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
const entityModel = {
    createEntite,
    getAllEntites,
    getEntityById,
    updateEntity,
    desactivateEntity,
    activateEntity,
    searchEntites,
    getAllActiveEntites,
    getAllInactiveEntites,
}
export default entityModel ; 