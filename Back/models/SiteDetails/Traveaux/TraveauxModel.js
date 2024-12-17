import { supabase } from "../../../config/supabaseClient.js";
// create Traveaux Model 
const createTraveaux = async (Sid, traveauxData) => {
    try {
        console.log('Incoming data for create Traveaux :', traveauxData);
      // Now insert the new Traveau into the 'Devis' table, using the PRid_fk field
      const { data: Traveau, error: contactError } = await supabase
        .from('Traveaux')
        .insert([{ EB_fk: Sid, ...traveauxData }])
        .select();
      if (contactError) {
        throw contactError;
      }
      // Extract the newly created Traveau ID (Tid)
      const Tid = Traveau[0].Tid;
      // Now associate the Traveau with the Site by inserting into 'Site-Traveau' association table
      const { data: siteTraveau, error: siteTraveauxError  } = await supabase
        .from('Site-Traveaux')
        .insert([{ Sid: Sid, Tid }]);
      if (siteTraveauxError ) {
        throw siteTraveauxError ;
      }
      // Return the successfully created Traveau and the association details
      return { success: true, data: { Traveau: Traveau[0], siteTraveau } };
    } catch (error) {
      console.error('Error in createTraveaux:', error.message);
      throw error; // Rethrow error for higher-level handling
    }
  };
// get all Traveaus
const getAllTraveaux = async (Sid) => {
    try {
        const { data, error } = await supabase
        .from('Traveaux')
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
// get Traveau by id
const getTraveauxById = async (id) => {
        try {
            const { data, error } = await supabase 
            .from('Traveaux')
            .select('*')
            .eq('Tid', id);
            if (error) {
                throw error;    
            }
            return { success: true, data };
        }catch(error){
            return { success: false, error: error.message };
        }
}
// get active Traveaus
const getActiveTraveaux = async (Sid) => {
        try {
            const { data, error } = await supabase
            .from('Traveaux')
            .select('*')
            .eq('is_active', true)
            .eq('EB_fk',Sid);
            ;
            if (error) {
                throw error;
            }
            return { success: true, data };
        }catch(error){
            return { success: false, error: error.message };
        }
}
// get inactive Traveaus
const getInactiveTraveaux = async (Sid) => {
    try {
        const { data, error } = await supabase
        .from('Traveaux')
        .select('*')
        .eq('is_active', false)
        .eq('EB_fk',Sid);
        if (error) {
            throw error;
        }
        return { success: true, data };
    }catch(error){
        return { success: false, error: error.message };
    }
}
// update Traveau Model 
const updateTraveaux = async (Tid, updates) => {
    try {
        const { data, error } = await supabase
        .from('Traveaux')
        .update(updates)
        .eq('Tid', Tid);
        if (error) {
            throw error;
        }
        return { success: true, data }; 
    } catch(error) {
        return { success: false, error: error.message };
    }
}
// activate Traveau Model 
const activateTraveaux = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Traveaux')
        .update({is_active:true})
        .eq('Tid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// Desactivate Traveau Model 
const desactivateTraveaux = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Traveaux')
        .update({is_active:false})
        .eq('Tid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// exporting all model's functions 
const traveauxModel = {
    createTraveaux,
    getInactiveTraveaux,
    getActiveTraveaux,
    updateTraveaux,
    getAllTraveaux,
    activateTraveaux,
    desactivateTraveaux,
    getTraveauxById,
}
export default traveauxModel;