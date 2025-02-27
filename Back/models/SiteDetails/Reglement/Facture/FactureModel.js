import { supabase } from "../../../../config/supabaseClient.js";
// create Facture Model 
const createFacture = async (Sid, factureData) => {
    try {
        console.log('Incoming data for create facture:', factureData);
      // Now insert the new Facture into the 'Devis' table, using the PRid_fk field
      const { data: Facture, error: factureError } = await supabase
        .from('Facture')
        .insert([{ EB_fk: Sid, ...factureData }])
        .select();
      if (factureError) {
        throw factureError;
      }
      // Extract the newly created Facture ID (Proid)
      const Facturefk = Facture[0].Fid;
      // Now associate the Facture with the Site by inserting into 'Site-Facture' association table
      const { data: siteFacture, error: siteFactureError  } = await supabase
        .from('Site-facture')
        .insert([{ Sid: Sid, Fid:Facturefk }]);
      if (siteFactureError ) {
        throw siteFactureError ;
      }
      // Return the successfully created Facture aFid the association details
      return { success: true, data: { Facture: Facture[0], siteFacture } };
    } catch (error) {
      console.error('Error in createFacture:', error.message);
      throw error; // Rethrow error for higher-level haFidling
    }
  };
// get all Factures
const getAllFacture = async (Sid) => {
    try {
        const { data, error } = await supabase
        .from('Facture')
        .select('*')
        .eq('EB_fk',Sid);
        if (error) {
            throw error;
        }
        return { success: true, data };
    }catch(error){
        return { success: false, error: error.message };
    }
}
// get Facture by id
const getFactureById = async (id) => {
        try {
            const { data, error } = await supabase 
            .from('Facture')
            .select('*')
            .eq('Fid', id);
            if (error) {
                throw error;    
            }
            return { success: true, data };
        }catch(error){
            return { success: false, error: error.message };
        }
}
// get active Factures
const getActiveFacture = async (factureId) => {
        try {
            const { data, error } = await supabase
            .from('Facture')
            .select('*')
            .eq('is_active', true)
            .eq('Fid',factureId);
            ;
            if (error) {
                throw error;
            }
            return { success: true, data };
        }catch(error){
            return { success: false, error: error.message };
        }
}
// get inactive Factures
const getInactiveFacture = async (factureId) => {
    try {
        const { data, error } = await supabase
        .from('Facture')
        .select('*')
        .eq('is_active', false)
        .eq('Fid',factureId);
        if (error) {
            throw error;
        }
        return { success: true, data };
    }catch(error){
        return { success: false, error: error.message };
    }
}
// update Facture Model 
const updateFacture = async (Fid, updates) => {
    try {
        const { data, error } = await supabase
        .from('Facture')
        .update(updates)
        .eq('Fid', Fid);
        if (error) {
            throw error;
        }
        return { success: true, data }; 
    } catch(error) {
        return { success: false, error: error.message };
    }
}
// activate Facture Model 
const activateFacture = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Facture')
        .update({is_active:true})
        .eq('Fid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// Desactivate Facture Model 
const desactivateFacture = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Facture')
        .update({is_active:false})
        .eq('Fid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// exporting all model's functions 
const factureModel = {
    createFacture,
    getInactiveFacture,
    getActiveFacture,
    updateFacture,
    getAllFacture,
    activateFacture,
    desactivateFacture,
    getFactureById,
}
export default factureModel; 