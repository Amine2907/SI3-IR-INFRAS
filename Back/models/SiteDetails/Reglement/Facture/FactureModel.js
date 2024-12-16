import { supabase } from "../../../config/supabaseClient.js";
// create Facture Model 
const createFacture = async (Devis_fk, factureData) => {
    try {
        console.log('Incoming data for create facture:', factureData);
      // Now insert the new Facture into the 'Devis' table, using the PRid_fk field
      const { data: Facture, error: contactError } = await supabase
        .from('Facture')
        .insert([{ Dfk: Devis_fk, ...factureData }])
        .select();
      if (contactError) {
        throw contactError;
      }
      // Extract the newly created Facture ID (Proid)
      const Facturefk = Facture[0].Fid;
      // Now associate the Facture with the Site by inserting into 'Site-Facture' association table
      const { data: siteFacture, error: devisFactureError  } = await supabase
        .from('Devis-Facture')
        .insert([{ Did: Devis_fk, Facturefk }]);
      if (devisFactureError ) {
        throw devisFactureError ;
      }
      // Return the successfully created Facture and the association details
      return { success: true, data: { Facture: Facture[0], siteFacture } };
    } catch (error) {
      console.error('Error in createFacture:', error.message);
      throw error; // Rethrow error for higher-level handling
    }
  };
// get all Factures
const getAllFacture = async (devisID) => {
    try {
        const { data, error } = await supabase
        .from('Facture')
        .select('*')
        .eq('ND',devisID);
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
const getActiveFacture = async (devisID) => {
        try {
            const { data, error } = await supabase
            .from('Facture')
            .select('*')
            .eq('is_active', true)
            .eq('ND',devisID);
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
const getInactiveFacture = async (devisID) => {
    try {
        const { data, error } = await supabase
        .from('Facture')
        .select('*')
        .eq('is_active', false)
        .eq('ND',devisID);
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