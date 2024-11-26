import { supabase } from "../../../config/supabaseClient.js";
import { status_validation } from "./ProspectData.js";
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
const fetchActiveProspect = async (siteID) => {
        try {
            const { data, error } = await supabase
            .from('Prospect')
            .select('*')
            .eq('is_active', true)
            .eq('EB_fk',siteID);
            if (error) {
                throw error;
            }
            return { success: true, data };
        }catch(error){
            return { success: false, error: error.message };
        }
}
const fetchinactiveProspect = async (siteID) => {
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
const updateProspect = async (id, updates) => {
    try {
         // Check and map `status_validation_fk` only if it's not already a valid ID
      if (updates.Status_validation_fk) {
        if (typeof updates.Status_validation_fk === 'string') {
          const Status_validation_fk = status_validation[updates.Status_validation_fk];
          if (!Status_validation_fk) {
            throw new Error(`Invalid status description: ${updates.Status_validation_fk}`);
          }
          updates.Status_validation_fk = Status_validation_fk;
        } else if (typeof updates.Status_validation_fk === 'number') {
          console.log('status_validation is already an ID:', updates.Status_validation_fk);
        } else {
          throw new Error(`Invalid structure for status_validation: ${updates.Status_validation_fk}`);
        }
      }
        const { data, error } = await supabase
        .from('Prospect')
        .update(updates)
        .eq('id', id);
        if (error) {
            throw error;
        }
        return { success: true, data }; 
    } catch(error) {
        return { success: false, error: error.message };
    }
}
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
// Desactivate Prospect
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
const prospectModel = {
    createProspect,
    fetchinactiveProspect,
    fetchActiveProspect,
    updateProspect,
    getAllProspects,
    activateprospect,
    desactivateProspect,
    getProspectById,
}
export default prospectModel; 