// MES (Mise en service)
import { supabase } from "../../../config/supabaseClient.js";
// create MES Model 
const createMes = async (Sid, mesData) => {
    try {
        // user can only add one and only mes with is_active = true 
        if (mesData.is_active === true)  {
            const { data: existingMes, error: checkError } = await supabase
              .from('MES')
              .select('*')
              .eq('EB_fk', Sid)  // Match using EB_fk  (the site identifier)
              .eq('is_active', true);  // Ensure we have only one mise en service which have is_active = True 
            if (checkError) {
              throw new Error(`Error fetching existing Dps: ${checkError.message}`);
            }
            if (existingMes && existingMes.length > 0) {
              throw new Error("This Site have already one mise en service  with active status already exists for this site.");
            }
          }
        console.log('Incoming data for create MES :', mesData);
      // Now insert the new mes into the 'Devis' table, using the PRid_fk field
      const { data: mes, error: contactError } = await supabase
        .from('MES')
        .insert([{ EB_fk: Sid, ...mesData }])
        .select();
      if (contactError) {
        throw contactError;
      }
      // Extract the newly created mes ID (MESid)
      const Mid = mes[0].MESid;
      // Now associate the mes with the Site by inserting into 'Site-mes' association table
      const { data: sitemes, error: sitemesError  } = await supabase
        .from('Site-Mes')
        .insert([{ Sid: Sid, Mid }]);
      if (sitemesError ) {
        throw sitemesError ;
      }
      // Return the successfully created mes and the association details
      return { success: true, data: { mes: mes[0], sitemes } };
    } catch (error) {
      console.error('Error in createMes:', error.message);
      throw error; // Rethrow error for higher-level handling
    }
  };
// get all mes
const getAllMes = async (Sid) => {
    try {
        const { data, error } = await supabase
        .from('MES')
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
// get mes by id
const getMesById = async (id) => {
        try {
            const { data, error } = await supabase 
            .from('MES')
            .select('*')
            .eq('MESid', id);
            if (error) {
                throw error;    
            }
            return { success: true, data };
        }catch(error){
            return { success: false, error: error.message };
        }
}
// get active mes
const getActiveMes = async (Sid) => {
        try {
            const { data, error } = await supabase
            .from('MES')
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
// get inactive mes
const getInactiveMes = async (Sid) => {
    try {
        const { data, error } = await supabase
        .from('MES')
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
// update mes Model 
const updateMes = async (MESid, updates) => {
    try {
        const { data, error } = await supabase
        .from('MES')
        .update(updates)
        .eq('MESid', MESid);
        if (error) {
            throw error;
        }
        return { success: true, data }; 
    } catch(error) {
        return { success: false, error: error.message };
    }
}
// activate mes Model 
const activateMes = async(id) => {
    try {
        const {data,error} = await supabase
        .from('MES')
        .update({is_active:true})
        .eq('MESid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// Desactivate mes Model 
const desactivateMes = async(id) => {
    try {
        const {data,error} = await supabase
        .from('MES')
        .update({is_active:false})
        .eq('MESid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// exporting all model's functions 
const mesModel = {
    createMes,
    getInactiveMes,
    getActiveMes,
    updateMes,
    getAllMes,
    activateMes,
    desactivateMes,
    getMesById,
}
export default mesModel; 