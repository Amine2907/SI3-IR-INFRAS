import { supabase } from "../../../config/supabaseClient.js";
import { etat } from "./DpData.js";
// create Dp Model 
const createDp = async (Sid , Proid, DpData) => {
    try {
        console.log('Incoming data for createDp:', DpData);
        if (DpData.etat_prerequis) {
            const statusID = etat[DpData.etat_prerequis];
            if (!statusID) {
              throw new Error(`Invalid status validation description: ${DpData.etat_prerequis}`);
            }
            DpData.etat_prerequis = statusID; // Update the prospect data with the numeric ID
          }
      if (DpData.is_active === true)  {
        console.log('Prospect has active DP');
        const { data: existingProspect, error: checkError } = await supabase
          .from('DP')
          .select('*')
          .eq('PRid_fk', Proid)  // Match using PRid_fk (the prospect identifier)
          .eq('is_active', true);  // Ensure no other DP with status active  exists for this prospect
        if (checkError) {
          throw new Error(`Error fetching existing Dps: ${checkError.message}`);
        }
        if (existingProspect && existingProspect.length > 0) {
          throw new Error("A DP with active status already exists for this site.");
        }
      }
       // user can only add one and only Declaration prealable where is_active = true
       if (DpData.is_active === true)  {
        const { data: exisitngDp, error: checkError } = await supabase
          .from('DP')
          .select('*')
          .eq('EB_fk', Sid)  // Match using EB_fk  (the site identifier)
          .eq('is_active', true);  // Ensure we have only one mise en service which have is_active = True 
        if (checkError) {
          throw new Error(`Error fetching existing Dps: ${checkError.message}`);
        }
        if (exisitngDp && exisitngDp.length > 0) {
          throw new Error("This Site have already one mise en service  with active status already exists for this site.");
        }
      }
      // Now insert the new Dp into the 'Dp' table, using the PRid_fk field
      const { data: Dp, error: contactError } = await supabase
        .from('DP')
        .insert([{  EB_fk: Sid,PRid_fk: Proid, ...DpData }])
        .select();
      if (contactError) {
        throw contactError;
      }
      // Extract the newly created Dp ID (Proid)
      const Dpfk = Dp[0].DPid;
      // Now associate the Dp with the Site by inserting into 'Site-Dp' association table
      const { data: siteDp, error: siteDpError } = await supabase
        .from('Prospect-DP')
        .insert([{ PRfk: Proid, Dpfk }]);
      if (siteDpError) {
        throw siteDpError;
      }
      // Return the successfully created Dp and the association details
      return { success: true, data: { Dp: Dp[0], siteDp } };
    } catch (error) {
      console.error('Error in createDp:', error.message);
      throw error; // Rethrow error for higher-level handling
    }
  };
// get all Dps
const getAllDps = async (Proid) => {
    try {
        const { data, error } = await supabase
        .from('DP')
        .select('*')
        .eq('PRid_fk',Proid);
        if (error) {
            throw error;
        }
        return { success: true, data };
    }catch(error){
        return { success: false, error: error.message };
    }
}
// get Dp by id
const getDpById = async (id) => {
        try {
            const { data, error } = await supabase 
            .from('DP')
            .select('*')
            .eq('DPid', id);
            if (error) {
                throw error;    
            }
            return { success: true, data };
        }catch(error){
            return { success: false, error: error.message };
        }
}
// get active Dps
const fetchActiveDp = async (prospectID) => {
        try {
            const { data, error } = await supabase
            .from('DP')
            .select('*')
            .eq('is_active', true)
            .eq('PRid_fk',prospectID);
            if (error) {
                throw error;
            }
            return { success: true, data };
        }catch(error){
            return { success: false, error: error.message };
        }
}
// get inactive Dps
const fetchInactiveDp = async (prospectID) => {
    try {
        const { data, error } = await supabase
        .from('DP')
        .select('*')
        .eq('is_active', false)
        .eq('PRid_fk',prospectID);
        if (error) {
            throw error;
        }
        return { success: true, data };
    }catch(error){
        return { success: false, error: error.message };
    }
}
// update Dp Model 
const updateDp = async (DpID, updates) => {
    try {
        // Ensure `etat_prerequis` is mapped correctly
        if (updates.etat_prerequis) {
            if (typeof updates.etat_prerequis === 'string') {
                const etatID = etat[updates.etat_prerequis]; // Map string to ID
                if (!etatID) {
                    throw new Error(`Invalid etat prerequis description: ${updates.etat_prerequis}`);
                }
                updates.etat_prerequis = etatID; // Replace with numeric ID
            } else if (typeof updates.etat_prerequis === 'object' && updates.etat_prerequis.EP_desc) {
                const etatID = etat[updates.etat_prerequis.EP_desc];
                if (!etatID) {
                    throw new Error(`Invalid etat prerequis  description: ${updates.etat_prerequis.EP_desc}`);
                }
                updates.etat_prerequis = etatID; // Replace with numeric ID
            } else if (typeof updates.etat_prerequis === 'number') {
                console.log('etat prerequis  is already an ID:', updates.etat_prerequis);
            } else {
                throw new Error(`Invalid structure for etat prerequis : ${updates.etat_prerequis}`);
            }
        }
        const { data, error } = await supabase
        .from('DP')
        .update(updates)
        .eq('DPid', DpID);
        if (error) {
            throw error;
        }
        return { success: true, data }; 
    } catch(error) {
        return { success: false, error: error.message };
    }
}
// activate Dp Model 
const activateDp = async(id) => {
    try {
        const {data,error} = await supabase
        .from('DP')
        .update({is_active:true})
        .eq('DPid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// Desactivate Dp Model 
const desactivateDp = async(id) => {
    try {
        const {data,error} = await supabase
        .from('DP')
        .update({is_active:false})
        .eq('DPid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
const getDpDataWithProspect = async (Sid) => {
    try {
      const { data, error } = await supabase
        .from('DP')
        .select(`
          status_go_traveauxR,
          Prospect!DP_PRid_fk_fkey (
            Proid
          )
        `)
        .eq('EB_fk', Sid)
        .eq('Prospect.is_active', true)
        .eq('Prospect.status_validation_fk', 25);
  
      if (error) {
        throw error;
      }
      // Process the data if needed
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching data with join:', error);
      return { success: false, error: error.message };
    }
  };
// exporting all model's functions 
const declarationPrealableModel = {
    createDp,
    fetchInactiveDp,
    fetchActiveDp,
    updateDp,
    getAllDps,
    activateDp,
    desactivateDp,
    getDpById,
    getDpDataWithProspect,
}
export default declarationPrealableModel; 