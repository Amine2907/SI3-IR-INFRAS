import { supabase } from "../../../config/supabaseClient.js";
// create PreEtude Model 
const createPreEtude = async (Sid, preEtudeData) => {
    try {
      const { data: preEtude, error: contactError } = await supabase
        .from('PreEtude')
        .insert([{ EB_fk: Sid , ...preEtudeData }])
        .select();
      if (contactError) {
        throw contactError;
      }
      // Extract the newly created PreEtude ID (PREid)
      const PrEt_fk = preEtude[0].PREid;
      // Now associate the PreEtude with the Site by inserting into 'Site-PreEtude' association table
      const { data: sitePreEtude, error: SitePreEtudeError } = await supabase
        .from('Site-PreEtude')
        .insert([{ Sid, PrEt_fk }]);
      if (SitePreEtudeError) {
        throw SitePreEtudeError;
      }
      // Return the successfully created preEtude and the association details
      return { success: true, data: { preEtude: preEtude[0], sitePreEtude } };
    } catch (error) {
      console.error('Error in create PreEtude:', error.message);
      throw error; // Rethrow error for higher-level handling
    }
  };
// get all PreEtudes
const getAllPreEtude = async (EB) => {
    try {
        const { data, error } = await supabase
        .from('PreEtude')
        .select('*')
        .eq('EB_fk',EB)
        if (error) {
            throw error;
        }
        return { success: true, data };
    }catch(error){
        return { success: false, error: error.message };
    }
}
// get PreEtude by id
const getPreEtudeById = async (id) => {
        try {
            const { data, error } = await supabase 
            .from('PreEtude')
            .select('*')
            .eq('Proid', id);
            if (error) {
                throw error;    
            }
            return { success: true, data };
        }catch(error){
            return { success: false, error: error.message };
        }
}
// get active PreEtudes
const fetchActivePreEtude = async (siteID) => {
        try {
            const { data, error } = await supabase
            .from('PreEtude')
            .select('*')
            .eq('is_active', true)
            .eq('EB_fk',siteID);
            ;
            if (error) {
                throw error;
            }
            return { success: true, data };
        }catch(error){
            return { success: false, error: error.message };
        }
}
// get inactive PreEtudes
const fetchInactivePreEtude = async (siteID) => {
    try {
        const { data, error } = await supabase
        .from('PreEtude')
        .select('*')
        .eq('is_active', false)
        .eq('EB_fk',siteID);
        if (error) {
            throw error;
        }
        return { success: true, data };
    }catch(error){
        return { success: false, error: error.message };
    }
}
// update PreEtude Model 
const updatePreEtude = async (preEtudeId, updates) => {
    try {
        const { data, error } = await supabase
        .from('PreEtude')
        .update(updates)
        .eq('PREid', preEtudeId);
        if (error) {
            throw error;
        }
        return { success: true, data }; 
    } catch(error) {
        return { success: false, error: error.message };
    }
}
// activate PreEtude Model 
const activatePreEtude = async(id) => {
    try {
        const {data,error} = await supabase
        .from('PreEtude')
        .update({is_active:true})
        .eq('PREid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// Desactivate PreEtude Model 
const desactivatePreEtude = async(id) => {
    try {
        const {data,error} = await supabase
        .from('PreEtude')
        .update({is_active:false})
        .eq('PREid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// exporting all model's functions 
const preEtudeModel = {
    createPreEtude,
    fetchInactivePreEtude,
    fetchActivePreEtude,
    updatePreEtude,
    getAllPreEtude,
    activatePreEtude,
    desactivatePreEtude,
    getPreEtudeById,
}
export default preEtudeModel; 