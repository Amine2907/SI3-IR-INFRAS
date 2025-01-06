import { supabase } from "../../../config/supabaseClient.js";
import { status_validation } from "./ProspectData.js";
// create Prospect Model 
const createProspect = async (EB, prospectData) => {
    try {
        console.log('Incoming data for createProspect:', prospectData);
        // Ensure the status validation description is mapped to the numeric ID
        if (prospectData.status_validation_fk) {
          const statusID = status_validation[prospectData.status_validation_fk];
          if (!statusID) {
            throw new Error(`Invalid status validation description: ${prospectData.status_validation_fk}`);
          }
          prospectData.status_validation_fk = statusID; // Update the prospect data with the numeric ID
        }
      // First check if the Status_validation_fk is 25 (Prospect Validé) and if any similar prospects exist
      if (prospectData.status_validation_fk === 25)  {
        console.log('Prospect has status "Prospect Validé"');
        const { data: existingProspect, error: checkError } = await supabase
          .from('Prospect')
          .select('*')
          .eq('EB_fk', EB)  // Match using EB_fk (the site identifier)
          .eq('status_validation_fk', 25);  // Ensure no other prospect with status 'Prospect Validé' exists for this site
  
        if (checkError) {
          throw new Error(`Error fetching existing prospect: ${checkError.message}`);
        }
  
        if (existingProspect && existingProspect.length > 0) {
          throw new Error("A prospect with status 'Prospect Validé' already exists for this site.");
        }
      }
      // User can add only one prospect which colunm is_active equal to True ! 
      if (prospectData.is_active === true)  {
        console.log('Prospect has active DP');
        const { data: existingProspect, error: checkError } = await supabase
          .from('Prospect')
          .select('*')
          .eq('EB_fk', EB)  // Match using EB_fk  (the site identifier)
          .eq('is_active', true);  // Ensure we have only one prospect which have is_active = True 
        if (checkError) {
          throw new Error(`Error fetching existing Dps: ${checkError.message}`);
        }
        if (existingProspect && existingProspect.length > 0) {
          throw new Error("This Site have already one prospect with active status already exists for this site.");
        }
      }
      // Now insert the new prospect into the 'Prospect' table, using the EB_fk field
      const { data: prospect, error: contactError } = await supabase
        .from('Prospect')
        .insert([{ EB_fk: EB, ...prospectData }])
        .select();
      if (contactError) {
        throw contactError;
      }
      // Extract the newly created Prospect ID (Proid)
      const PRid_FK = prospect[0].Proid;
      // Now associate the Prospect with the Site by inserting into 'Site-Prospect' association table
      const { data: siteProspect, error: siteProspectError } = await supabase
        .from('Site-Prospect')
        .insert([{ EB_FK: EB, PRid_FK }]);
      if (siteProspectError) {
        throw siteProspectError;
      }
      // Return the successfully created prospect and the association details
      return { success: true, data: { prospect: prospect[0], siteProspect } };
    } catch (error) {
      console.error('Error in createProspect:', error.message);
      throw error; // Rethrow error for higher-level handling
    }
  };
// get all prospects
const getAllProspects = async (EB) => {
    try {
        const { data, error } = await supabase
        .from('Prospect')
        .select('*')
        .eq('EB_fk',EB);
        if (error) {
            throw error;
        }
        return { success: true, data };
    }catch(error){
        return { success: false, error: error.message };
    }
}
// get Prospect by id
const getProspectById = async (id) => {
        try {
            const { data, error } = await supabase 
            .from('Prospect')
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
// get active prospects
const fetchActiveProspect = async (siteID) => {
        try {
            const { data, error } = await supabase
            .from('Prospect')
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
// get inactive prospects
const fetchInactiveProspect = async (siteID) => {
    try {
        const { data, error } = await supabase
        .from('Prospect')
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
// update Prospect Model 
const updateProspect = async (prospectID, updates) => {
    try {
        // Check if the update includes activation and is actually changing to true
        if (
            updates.hasOwnProperty('is_active') &&
            updates.is_active === true
          ) {
            // Fetch other active prospects, excluding the current one
            const { data: activeProspects, error: fetchError } = await supabase
              .from('Prospect')
              .select('Proid')
              .eq('is_active', true)
              .neq('Proid', prospectID);
      
            if (fetchError) {
              throw new Error(`Error fetching active prospects: ${fetchError.message}`);
            }
            // Prevent activation if there's already another active prospect
            if (activeProspects && activeProspects.length > 0) {
              throw new Error(
                'An active prospect already exists. Please deactivate it before activating another one.'
              );
            }
          }
        // Ensure `status_validation_fk` is mapped correctly
        if (updates.status_validation_fk) {
            if (typeof updates.status_validation_fk === 'string') {
                const statusID = status_validation[updates.status_validation_fk]; // Map string to ID
                if (!statusID) {
                    throw new Error(`Invalid status description: ${updates.status_validation_fk}`);
                }
                updates.status_validation_fk = statusID; // Replace with numeric ID
            } else if (typeof updates.status_validation_fk === 'object' && updates.status_validation_fk.SV_desc) {
                const statusID = status_validation[updates.status_validation_fk.SV_desc];
                if (!statusID) {
                    throw new Error(`Invalid status description: ${updates.status_validation_fk.SV_desc}`);
                }
                updates.status_validation_fk = statusID; // Replace with numeric ID
            } else if (typeof updates.status_validation_fk === 'number') {
                console.log('status_validation is already an ID:', updates.status_validation_fk);
            } else {
                throw new Error(`Invalid structure for status_validation: ${updates.status_validation_fk}`);
            }
        }
        const { data, error } = await supabase
        .from('Prospect')
        .update(updates)
        .eq('Proid', prospectID);
        if (error) {
            throw error;
        }
        return { success: true, data }; 
    } catch(error) {
        return { success: false, error: error.message };
    }
}
// activate Prospect Model 
const activateprospect = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Prospect')
        .update({is_active:true})
        .eq('Proid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// Desactivate Prospect Model 
const desactivateProspect = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Prospect')
        .update({is_active:false})
        .eq('Proid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// exporting all model's functions 
const prospectModel = {
    createProspect,
    fetchInactiveProspect,
    fetchActiveProspect,
    updateProspect,
    getAllProspects,
    activateprospect,
    desactivateProspect,
    getProspectById,
}
export default prospectModel; 