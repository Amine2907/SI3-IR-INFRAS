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
const getActiveEntites = async () => {
    try {
        const { data, error } = await supabase
            .from('Entite')
            .select('Eid, nom')
            .eq('is_active', true);
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
const createDr = async (EB, demracData) => {
    try {
        // Fetch active entites list
        const activeentitesResponse = await getActiveEntites();
        console.log('Active entites Response:', activeentitesResponse);

        if (!activeentitesResponse.success || !Array.isArray(activeentitesResponse.data)) {
            throw new Error('Active entites data is not an array.');
        }
        const activeentites = activeentitesResponse.data;
        if (activeentites.length === 0) {
            throw new Error('No active entites found.');
        }

        // Convert gestionnaire_de_reseau name to Eid
        if (typeof demracData.gestionnaire_de_reseau === 'object' && demracData.gestionnaire_de_reseau.nom) {
            const entiteName = demracData.gestionnaire_de_reseau.nom;
            console.warn('Converting entite name to entite ID:', entiteName);

            const entite = activeentites.find(e => e.nom === entiteName);
            if (entite) {
                demracData.gestionnaire_de_reseau = entite.Eid;
            } else {
                throw new Error(`No entite found with name: ${entiteName}`);
            }
        }

        // Fetch active prospects list
        const activeprospectsResponse = await getActiveProspects(EB);
        console.log('Active prospects Response:', activeprospectsResponse);

        if (!activeprospectsResponse.success || !Array.isArray(activeprospectsResponse.data)) {
            throw new Error('Active prospects data is not an array.');
        }
        const activeProspects = activeprospectsResponse.data;
        // Convert Pro_fk name to Proid
        if (typeof demracData.Pro_fk === 'object' && demracData.Pro_fk.nom) {
            const prospectName = demracData.Pro_fk.nom;
            console.warn('Converting prospect name to Proid:', prospectName);
            const prospect = activeProspects.find(p => p.nom === prospectName);
            if (prospect) {
                demracData.Pro_fk = prospect.Proid;
            } else {
                throw new Error(`No prospect found with name: ${prospectName}`);
            }
        }
        // Fetch active devis list
        const activedevisResponse = await getActiveDevis(EB);
        console.log('Active devis Response:', activedevisResponse);

        if (!activedevisResponse.success || !Array.isArray(activedevisResponse.data)) {
            throw new Error('Active devis data is not an array.');
        }
        const activeDevis = activedevisResponse.data;

        // Convert no_devis ND to appropriate ID
        if (typeof demracData.no_devis === 'object' && demracData.no_devis.ND) {
            const devisName = demracData.no_devis.ND;
            console.warn('Converting devis ND to ID:', devisName);

            const devis = activeDevis.find(d => d.ND === devisName);
            if (devis) {
                demracData.no_devis = devis.ND;
            } else {
                throw new Error(`No devis found with name: ${devisName}`);
            }
        }

        // Handle SPRid_FK mapping
        if (typeof demracData.SPRid_FK === 'object' && demracData.SPRid_FK.SPR_desc) {
            const priorityDesc = demracData.SPRid_FK.SPR_desc;
            const statpropId = statusPropmapping[priorityDesc];
            if (!statpropId) {
                throw new Error(`Invalid priority description: ${priorityDesc}`);
            }
            demracData.SPRid_FK = statpropId;
        }

        // Insert data into the database
        const { data: demrac, error: contactError } = await supabase
            .from('DR')
            .insert([{ EB_fk: EB, ...demracData }])
            .select();

        if (contactError) {
            throw contactError;
        }
        // Link DR with the site
        const NDR_fk = demrac[0].NDRid;
        const { data: siteDemrac, error: siteDemracError } = await supabase
            .from('Site-Dr')
            .insert([{ EB_fk: EB, NDR_fk }]);
        if (siteDemracError) {
            throw siteDemracError;
        }
        return { success: true, data: { demrac: demrac[0], siteDemrac } };
    } catch (error) {
        console.error('Error in createDR:', error.message);
        throw error;
    }
};
//GetAllDrs
const getAllDrs = async(EB) => {
    try {
        const {data,error} = await supabase
        .from('DR')
            .select('*')
            .eq('EB_fk',EB);
        if(error){
            throw error;
        }
        return {success:true , data};
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// Get all active Drs
const getAllActiveDrs = async(EB) => {
    try {
        const {data,error} = await supabase
        .from('DR')
        .select('*')
        .eq('is_active',true)
        .eq('EB_fk',EB);

        if(error){
            throw error;
        }
        return {success:true , data};
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
const getAllInactiveDrs = async(EB) => {
    try {
        const {data,error} = await supabase
        .from('DR')
        .select('*')
        .eq('is_active',false)
        .eq('EB_fk',EB);

        if(error){
            throw error;
        }
        return {success:true , data};
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
//getDrsById 
const getDrsById = async(NDRid) => {
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
      if (!updates.no_devis || !updates.no_devis.ND) {
        delete updates.no_devis;
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
    getDrsById,
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