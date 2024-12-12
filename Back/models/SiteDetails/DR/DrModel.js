/**
 * This file contains the model for the Drs feature.
 * It provides functions to interact with the supabase instance.
 * The functions are:
 * - createDr: creates a Dr in the database
 * - getAllDrs: gets all the Drs in the database
 * - getDrById: gets a Dr by its ID
 * - updateDr: updates a Dr in the database
 * - deactivateDr: deactivates a Dr in the database
 * - activateDr: activates a Dr in the database
 * - SearchDrs: searches Drs in the database
 * - getActiveDrs: gets all the active Drs in the database
 * - getInactiveDrs: gets all the inactive Drs in the database
 */
import { supabase } from "../../../config/supabaseClient.js";
import { statusPropmapping } from "./DrData.js";
const getActiveEntites = async (Sid) => {
    try {
        const { data, error } = await supabase
            .from('Entite')
            .select('Eid, nom')
            .eq('is_active', true)
            .eq('EB_fk',Sid)
            ;
        if (error) {
            throw new Error(`Error fetching active entites: ${error.message}`);
        }
        return {success:true , data}; // Return active entites data (list of objects with Eid and nom)
    } catch (error) {
        console.error(error);
        return []; // Return empty array if an error occurs
    }
};
const getActiveProspects = async (Sid) => {
    try {
        const { data, error } = await supabase
            .from('Prospect')
            .select('Proid, nom')
            .eq('is_active', true)
            .eq('EB_fk',Sid);
        if (error) {
            throw new Error(`Error fetching active entites: ${error.message}`);
        }
        return {success:true , data}; // Return active entites data (list of objects with Eid and nom)
    } catch (error) {
        console.error(error);
        return []; // Return empty array if an error occurs
    }
};
const getActiveDevis = async (Sid) => {
    try {
        const { data, error } = await supabase
            .from('Devis')
            .select('ND')
            .eq('is_active', true)
            .eq('EB_fk',Sid);
        if (error) {
            throw new Error(`Error fetching active Devis: ${error.message}`);
        }
        return {success:true , data}; // Return active entites data (list of objects with Eid and nom)
    } catch (error) {
        console.error(error);
        return []; // Return empty array if an error occurs
    }
};
//Create Dr
const createDr = async (data) => {
    try {
        // Fetch active entites list
        const activeentitesResponse = await getActiveEntites();
        // Log the response to ensure it's correct
        console.log('Active entites Response:', activeentitesResponse);
        // Check if the response is successful and if the data is an array
        if (!activeentitesResponse.success) {
            throw new Error('Failed to fetch active entites');
        }
        const activeentites = activeentitesResponse.data;
        if (!Array.isArray(activeentites)) {
            throw new Error('Active entites data is not an array.');
        }
        if (activeentites.length === 0) {
            throw new Error('No active entites found');
        }
        // Log the incoming data to inspect gestionnaire_de_reseau
        console.log('Incoming data for createDr:', data);

        // If gestionnaire_de_reseau is a string (entite name), convert it to the corresponding entite ID
        if (typeof data.gestionnaire_de_reseau === 'string') {
            const entiteName = data.gestionnaire_de_reseau;
            console.warn('Converting entite name to entite ID:', entiteName);

            // Find the entite in the activeentites list based on entite name
            const entite = activeentites.find(entite => entite.nom === entiteName);

            if (entite) {
                // Replace the entite name with the corresponding entite ID
                data.gestionnaire_de_reseau = entite.Eid;
            } else {
                throw new Error(`No entite found with name: ${entiteName}`);
            }
        }
        // /////////////////////////////////////////////////////////////////////////////////
                // Fetch active prospetcs list
                const activeprospectsResponse = await getActiveProspects();
                // Log the response to ensure it's correct
                console.log('Active prospects Response:', activeprospectsResponse);
                // Check if the response is successful and if the data is an array
                if (!activeprospectsResponse.success) {
                    throw new Error('Failed to fetch active prospects');
                }
                const activeProspects = activeprospectsResponse.data;
                if (!Array.isArray(activeProspects)) {
                    throw new Error('Active prospects data is not an array.');
                }
                if (activeentites.length === 0) {
                    throw new Error('No active prospects found');
                }
                // Log the incoming data to inspect Pro_fk
                console.log('Incoming data for createDr:', data);
        
                // If Pro_fk is a string (prospect name), convert it to the corresponding entite ID
                if (typeof data.Pro_fk === 'string') {
                    const prospectName = data.Pro_fk;
                    console.warn('Converting entite name to entite ID:', prospectName);
        
                    // Find the prospect in the activeentites list based on entite name
                    const prospect = activeentites.find(prospect => prospect.nom === prospectName);
        
                    if (prospect) {
                        // Replace the prospect name with the corresponding entite ID
                        data.Pro_fk = prospect.Proid;
                    } else {
                        throw new Error(`No prospect found with name: ${prospectName}`);
                    }
                }
        // ///////////////////////////////////////////////////////////////////////////////
                // Fetch active entites list
                const activedevisResponse = await getActiveDevis();
                // Log the response to ensure it's correct
                console.log('Active entites Response:', activedevisResponse);
                // Check if the response is successful and if the data is an array
                if (!activedevisResponse.success) {
                    throw new Error('Failed to fetch active entites');
                }
                const activeDevis = activedevisResponse.data;
                if (!Array.isArray(activeDevis)) {
                    throw new Error('Active entites data is not an array.');
                }
                if (activeDevis.length === 0) {
                    throw new Error('No active entites found');
                }
                // Log the incoming data to inspect gestionnaire_de_reseau
                console.log('Incoming data for createDr:', data);
                // If gestionnaire_de_reseau is a string (entite name), convert it to the corresponding entite ID
                if (typeof data.no_devis === 'string') {
                    const devisName = data.no_devis;
                    console.warn('Converting entite name to entite ID:', devisName);
        
                    // Find the entite in the activeentites list based on entite name
                    const devis = activeDevis.find(devis => devis.nom === devisName);
        
                    if (devis) {
                        // Replace the entite name with the corresponding entite ID
                        data.no_devis = devis.ND;
                    } else {
                        throw new Error(`No entite found with name: ${devisName}`);
                    }
                }
        // Check and map SPRid_FK, programme_fk, and status_Dr_fk to their corresponding IDs
        if (data.SPRid_FK) {
            const statpropId = statusPropmapping[data.SPRid_FK];
            if (!statpropId) {
                throw new Error(`Invalid priority description: ${data.SPRid_FK}`);
            }
            data.SPRid_FK = statpropId;
        }
        // Insert data into the database
        const { data: result, error } = await supabase
            .from('DR')
            .insert([data]);
        if (error) {
            throw error;
        }
        return { success: true, result };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
//GetAllDrs
const getAllDrs = async() => {
    try {
        const {data,error} = await supabase
        .from('DR')
        // depends on use i will decide if im gonna use the query or not 
        .select(`
            * ,
            SPRid_FK:SPR(SPR_desc),
            gestionnaire_de_reseau:Entite(nom)
            Pro_fk:Propsect(nom)
            no_devis:Devis(ND)
            `)
            .eq('Entite.is_active', true)
            .eq('Prospect.is_active', true)
            .eq('Devis.is_active',true);
        if(error){
            throw error;
        }
        return {success:true , data};
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// Get all active Drs
const getAllActiveDrs = async() => {
    try {
        const {data,error} = await supabase
        .from('DR')
        .select('*')
        .eq('is_active',true);

        if(error){
            throw error;
        }
        return {success:true , data};
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
const getAllInactiveDrs = async() => {
    try {
        const {data,error} = await supabase
        .from('DR')
        .select('*')
        .eq('is_active',false);

        if(error){
            throw error;
        }
        return {success:true , data};
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
//GetDrsById 
const GetDrsById = async(NDRid) => {
    try {
        const {data,error} = await supabase
        .from('DR')
        .select('*')
        .eq('NDRid',NDRid);
        if(error){
            throw error ;
        }
        return {success:true , data };
    }catch(error){
        return {success:false ,error:error.messsage};
    }
};
//Update Drs 
const updateDr = async (NDRid, updates) => {
    try {
        //Active ENtites
      // Fetch active entites list (if necessary for mapping)
      const activeentitesResponse = await getActiveEntites();
      console.log('Active entites Response:', activeentitesResponse);
      if (!activeentitesResponse.success) {
        throw new Error('Failed to fetch active entites');
      }
      const activeentites = activeentitesResponse.data;
      if (!Array.isArray(activeentites)) {
        throw new Error('Active entites data is not an array.');
      }
      console.log('Incoming updates for updateDr:', updates);
  
      // Handle gestionnaire_de_reseau conversion (if provided as a name)
      if (updates.gestionnaire_de_reseau && typeof updates.gestionnaire_de_reseau === 'string') {
        const entiteName = updates.gestionnaire_de_reseau;
        const entite = activeentites.find(entite => entite.nom === entiteName);
        if (entite) {
          updates.gestionnaire_de_reseau = entite.Eid;
        } else {
          throw new Error(`No entite found with name: ${entiteName}`);
        }
      }
    //   Active Propspecs 
     // Fetch active prospects list (if necessary for mapping)
     const activepropsectsResponse = await getActiveEntites();
     console.log('Active entites Response:', activepropsectsResponse);
     if (!activepropsectsResponse.success) {
       throw new Error('Failed to fetch active entites');
     }
     const activePropsects = activepropsectsResponse.data;
     if (!Array.isArray(activePropsects)) {
       throw new Error('Active prospects data is not an array.');
     }
     console.log('Incoming updates for updateDr:', updates);
     // Handle Pro_fk conversion (if provided as a name)
     if (updates.Pro_fk && typeof updates.Pro_fk === 'string') {
       const prospectName = updates.Pro_fk;
       const prospect = activePropsects.find(prospect => prospect.nom === prospectName);
       if (prospect) {
         updates.Pro_fk = prospect.Proid;
       } else {
         throw new Error(`No prospects found with name: ${prospectName}`);
       }
     }
        //Active Devis
      // Fetch active devis list (if necessary for mapping)
      const activedevisResponse = await getActiveDevis();
      console.log('Active devis Response:', activedevisResponse);
      if (!activedevisResponse.success) {
        throw new Error('Failed to fetch active devis');
      }
      const activedevis = activedevisResponse.data;
      if (!Array.isArray(activedevis)) {
        throw new Error('Active devis data is not an array.');
      }
      console.log('Incoming updates for updateDr:', updates);
      // Handle no_devis conversion (if provided as a name)
      if (updates.no_devis && typeof updates.no_devis === 'string') {
        const devisName = updates.no_devis;
        const devis = activedevis.find(devis => devis.ND === devisName);
        if (devis) {
          updates.no_devis = devis.ND;
        } else {
          throw new Error(`No devis found with name: ${devisName}`);
        }
      }
      // Check and map `SPRid_FK` only if it's not already a valid ID
      if (updates.SPRid_FK) {
        if (typeof updates.SPRid_FK === 'string') {
          const statpropId = statusPropmapping[updates.SPRid_FK];
          if (!statpropId) {
            throw new Error(`Invalid status prop  description: ${updates.SPRid_FK}`);
          }
          updates.SPRid_FK = statpropId;
        } else if (typeof updates.SPRid_FK === 'number') {
          console.log('SPRid_FK is already an ID:', updates.SPRid_FK);
        } else {
          throw new Error(`Invalid structure for SPRid_FK: ${updates.SPRid_FK}`);
        }
      }
      console.log('Transformed updates ready for database operation:', updates);
      // Perform the update operation in the database
      const { data, error } = await supabase
        .from('DR')
        .update(updates)
        .eq('NDRid', NDRid);
      if (error) {
        console.error('Supabase Error:', error); // Log the error
        return { success: false, error: error.message }; // Return the error message
      }
      return { success: true, data }; // Return success with updated data
    } catch (err) {
      console.error('Catch Block Error:', err); // Log unexpected errors
      return { success: false, error: err.message }; // Return the error message
    }
  };
// Activate Drs 
const activateDr = async(id) => {
    try {
        const {data,error} = await supabase
        .from('DR')
        .update({is_active:true})
        .eq('NDRid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// Desactivate Drs
const desactivateDr = async(id) => {
    try {
        const {data,error} = await supabase
        .from('DR')
        .update({is_active:false})
        .eq('NDRid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
const drModel = {
    createDr,
    getAllDrs,
    GetDrsById,
    updateDr,
    activateDr,
    desactivateDr,
    getAllActiveDrs,
    getAllInactiveDrs,
    getActiveEntites,
    getActiveProspects,
    getActiveDevis,
}
export default drModel ; 