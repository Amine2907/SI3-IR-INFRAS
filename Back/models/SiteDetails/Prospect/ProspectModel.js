import { supabase } from "../../../config/supabaseClient.js";
import { status_validation } from "./ProspectData.js";
const createProspect = async (data) => {
    try {
        if (data.Status_validation_fk) {
            const Status_validation_fk = status_validation[data.Status_validation_fk];
            if (!Status_validation_fk) {
                throw new Error(`Invalid status validation description: ${data.Status_validation_fk}`);
            }
            data.Status_validation_fk = Status_validation_fk;
        }
        const {EB , Status_validation_fk  } = data ; 
        if ( Status_validation_fk === 25 ) {
            const {data : exisitingPropect , error : checkError} = await supabase
            .from('Prospect')
            .select('*')
            .eq('EB_fk',EB)
            .eq('Status_validation_fk',25);
            if (checkError) {
                throw new Error(`Error fetching existing prospect: ${checkError.message}`);
            }
            if(exisitingPropect && exisitingPropect.length > 0) {
                throw new Error("Le prospect existe déjà et est en attente de validation.");
            }
        }
        const result = await supabase
        .from('Prospect')
        .insert([data])
        .select('*');
        if (result.error) { 
            throw result.error;
        }
        const siteProspectAssociation = {
            site_fk : EB,
            Prospect_fk : result.data[0].Proid,
        };
        const assoicationResult = await supabase
        .from('Site-Prospect')
        .insert([siteProspectAssociation]);
        if (assoicationResult.error) {
            throw assoicationResult.error;
        }
        if (result.data && assoicationResult.data) {
            return { success: true, data: result.data[0] };
        }
    }catch(error) {
        return { success: false, error: error.message };
    }
}
const fetchAllProspects = async () => {
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
const ProspectModel = {
    createProspect,
    fetchinactiveProspect,
    fetchActiveProspect,
    updateProspect,
    fetchAllProspects,
    activateprospect,
    desactivateProspect,
}
export default ProspectModel; 