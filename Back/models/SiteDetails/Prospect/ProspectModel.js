import { supabase } from "../../../config/supabaseClient.js";
import { status_validation } from "./ProspectData.js";
const createProspect = async (Sid, prospectData) => {
    try {
        if (data.Status_validation_fk === 25) {
            const { data: existingProspect, error: checkError } = await supabase
              .from('Prospect')
              .select('*')
              .eq('EB_fk', EB)
              .eq('Status_validation_fk', 25);
            if (checkError) {
              throw new Error(`Error fetching existing prospect: ${checkError.message}`);
            }
            if (existingProspect && existingProspect.length > 0) {
              throw new Error("A prospect with status 'Prospect Validé' already exists for this site.");
            }
        }
      // Insert the new contact
      const { data: prospect, error: contactError } = await supabase
        .from('Prospect')
        .insert([{EB_fk:EB ,...prospectData}])
        .select();
      if (contactError) {
        throw contactError;
      }
      // Extract the new contact ID
      const Proid = prospect[0].Proid;
      // Associate the new contact with the site
      const { data: siteProspect, error: siteProspectError } = await supabase
        .from('Site-Prospect')
        .insert([{ Sid, Proid }]);
      if (siteProspectError) {
        throw siteProspectError;
      }
      // Return both contact and site contact data
      return { prospect: prospect[0], siteProspect };  // This is the data being returned
    } catch (error) {
      console.error('Error in addNewContactSite:', error.message);
      throw error;
    }
  };
const getAllProspects = async () => {
    try {
        const { data, error } = await supabase
        .from('Prospect')
        .select('*');
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
const fetchActiveProspect = async () => {
        try {
            const { data, error } = await supabase
            .from('Prospect')
            .select('*')
            .eq('is_active', true);
            if (error) {
                throw error;
            }
            return { success: true, data };
        }catch(error){
            return { success: false, error: error.message };
        }
}
const fetchinactiveProspect = async () => {
    try {
        const { data, error } = await supabase
        .from('Prospect')
        .select('*')
        .eq('is_active', false);
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