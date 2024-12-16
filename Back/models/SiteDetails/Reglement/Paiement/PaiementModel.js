import { supabase } from "../../../config/supabaseClient.js";
// create Paiement Model 
const createPaiement = async (Devis_fk, paiementData) => {
    try {
        console.log('Incoming data for create Paiement:', paiementData);
      // Now insert the new Paiement into the 'Devis' table, using the PRid_fk field
      const { data: Paiement, error: contactError } = await supabase
        .from('Paiement')
        .insert([{ no_devis: Devis_fk, ...paiementData }])
        .select();
      if (contactError) {
        throw contactError;
      }
      // Extract the newly created Paiement ID (Pid)
      const Paiementfk = Paiement[0].Pid;
      // Now associate the Paiement with the Site by inserting into 'Site-Paiement' association table
      const { data: sitePaiement, error: devisPaiementError  } = await supabase
        .from('Devis-Paiement')
        .insert([{ Did: Devis_fk, Paiementfk }]);
      if (devisPaiementError ) {
        throw devisPaiementError ;
      }
      // Return the successfully created Paiement and the association details
      return { success: true, data: { Paiement: Paiement[0], sitePaiement } };
    } catch (error) {
      console.error('Error in createPaiement:', error.message);
      throw error; // Rethrow error for higher-level handling
    }
  };
// get all Paiements
const getAllPais = async (devisID) => {
    try {
        const { data, error } = await supabase
        .from('Paiement')
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
// get Paiement by id
const getPaiementById = async (id) => {
        try {
            const { data, error } = await supabase 
            .from('Paiement')
            .select('*')
            .eq('Pid', id);
            if (error) {
                throw error;    
            }
            return { success: true, data };
        }catch(error){
            return { success: false, error: error.message };
        }
}
// get active Paiements
const getActivePaiement = async (devisID) => {
        try {
            const { data, error } = await supabase
            .from('Paiement')
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
// get inactive Paiements
const getInactivePaiement = async (devisID) => {
    try {
        const { data, error } = await supabase
        .from('Paiement')
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
// update Paiement Model 
const updatePaiement = async (Pid, updates) => {
    try {
        const { data, error } = await supabase
        .from('Paiement')
        .update(updates)
        .eq('Pid', Pid);
        if (error) {
            throw error;
        }
        return { success: true, data }; 
    } catch(error) {
        return { success: false, error: error.message };
    }
}
// activate Paiement Model 
const activatePaiement = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Paiement')
        .update({is_active:true})
        .eq('Pid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// Desactivate Paiement Model 
const desactivatePaiement = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Paiement')
        .update({is_active:false})
        .eq('Pid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// exporting all model's functions 
const paiementModel = {
    createPaiement,
    getInactivePaiement,
    getActivePaiement,
    updatePaiement,
    getAllPais,
    activatePaiement,
    desactivatePaiement,
    getPaiementById,
}
export default paiementModel; 