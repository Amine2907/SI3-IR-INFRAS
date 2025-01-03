import { supabase } from "../../../config/supabaseClient.js";
// create PreEtude Model 
const createPreEtude = async (Sid, preEtudeData) => {
    try {
    // User can add only one preEtude which colunm is_active equal to True ! 
      if (preEtudeData.is_active === true)  {
        const { data: existingPreEtude, error: checkError } = await supabase
          .from('PreEtude')
          .select('*')
          .eq('EB_fk', Sid)  // Match using EB_fk  (the site identifier)
          .eq('is_active', true);  // Ensure we have only one preEtude which have is_active = True 
        if (checkError) {
          throw new Error(`Error fetching existing Dps: ${checkError.message}`);
        }
        if (existingPreEtude && existingPreEtude.length > 0) {
          throw new Error("This Site have already one preEtude with active status already exists for this site.");
        }
      }
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
const getAllPreEtudeT = async (Proid) => {
    try {
        const { data, error } = await supabase
        .from('PreEtude')
        .select('*')
        .eq('PRid_fk',Proid);
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
    // Ensure only one PreEtude entry can be active at a time, if applicable
    if (updates.is_active === true) {
        const { data: activePreEtudes, error: fetchError } = await supabase
          .from('PreEtude')
          .select('PREid')
          .eq('is_active', true);
  
        if (fetchError) {
          throw new Error(`Error fetching active PreEtude entries: ${fetchError.message}`);
        }
  
        if (activePreEtudes && activePreEtudes.length > 0) {
          throw new Error(
            'An active PreEtude entry already exists. Please deactivate it before activating another one.'
          );
        }
      }
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
    getAllPreEtudeT,
}
export default preEtudeModel; 