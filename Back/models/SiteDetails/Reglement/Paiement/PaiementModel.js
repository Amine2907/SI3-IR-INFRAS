import { supabase } from "../../../../config/supabaseClient.js";
// create Paiement Model 
const createPaiement = async (Sid, paiementData) => {
    try {
      console.log('Incoming data for create Paiement:', paiementData);
      // Insert the new Paiement into the 'Paiements' table
      const { data: Paiement, error: paiementError } = await supabase
        .from('Paiements')
        .insert([{ EB_fk: Sid, ...paiementData }])
        .select();
      if (paiementError) {
        console.error('Error inserting into Paiements:', paiementError.message);
        throw new Error('Error inserting Paiement: ' + paiementError.message);
      }
      // Extract the newly created Paiement ID (Pid)
      const Paiementfk = Paiement[0].Pid;
  
      // Associate the Paiement with the Site in the 'Site-Paie' table
      const { error: sitePaiementError } = await supabase
        .from('Site-paie')
        .insert([{Sid, Pid: Paiementfk }]);
      if (sitePaiementError) {
        console.error('Error associating Paiement with Site:', sitePaiementError.message);
        throw new Error('Error associating Paiement with Site: ' + sitePaiementError.message);
      }
      // Return the successfully created Paiement and its associations
      return { success: true, data: { Paiement: Paiement[0] } };
    } catch (error) {
      console.error('Error in createPaiement:', error.message);
      throw error; // Rethrow error for higher-level handling
    }
  };
// get all Paiements
const getAllPais = async (Sid) => {
    try {
        const { data, error } = await supabase
        .from('Paiements')
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
// get Paiement by id
const getPaiementById = async (id) => {
        try {
            const { data, error } = await supabase 
            .from('Paiements')
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
const getActivePaiement = async (paieId) => {
        try {
            const { data, error } = await supabase
            .from('Paiements')
            .select('*')
            .eq('is_active', true)
            .eq('ND',paieId);
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
const getInactivePaiement = async (paieId) => {
    try {
        const { data, error } = await supabase
        .from('Paiements')
        .select('*')
        .eq('is_active', false)
        .eq('ND',paieId);
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
        .from('Paiements')
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
        .from('Paiements')
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
        .from('Paiements')
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