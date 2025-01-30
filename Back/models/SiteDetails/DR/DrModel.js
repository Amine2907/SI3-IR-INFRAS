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
import entityModel from "../../Entites/entiteModel.js";
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
        // Fetch active entities
        const activeEntitiesResponse = await entityModel.getAllActiveEntites();
        if (!activeEntitiesResponse.success || !Array.isArray(activeEntitiesResponse.data)) {
            throw new Error('Failed to fetch active entities.');
        }
        const activeEntities = activeEntitiesResponse.data;

        // Map gestionnaire_de_reseau.nom -> Eid
        if (demracData.gestionnaire_de_reseau?.nom) {
            const entity = activeEntities.find(e => e.nom === demracData.gestionnaire_de_reseau.nom);
            if (!entity) {
                throw new Error(`Entity not found for name: ${demracData.gestionnaire_de_reseau.nom}`);
            }
            demracData.gestionnaire_de_reseau = entity.Eid;
        }
        // Fetch active prospects
        const activeProspectsResponse = await getActiveProspects(EB);
        if (!activeProspectsResponse.success || !Array.isArray(activeProspectsResponse.data)) {
            throw new Error('Failed to fetch active prospects.');
        }
        const activeProspects = activeProspectsResponse.data;

        // Map Pro_fk.nom -> Proid
        if (demracData.Pro_fk?.nom) {
            const prospect = activeProspects.find(p => p.nom === demracData.Pro_fk.nom);
            if (!prospect) {
                throw new Error(`Prospect not found for name: ${demracData.Pro_fk.nom}`);
            }
            demracData.Pro_fk = prospect.Proid;
        }

        // Fetch active devis
        const activeDevisResponse = await getActiveDevis(EB);
        if (!activeDevisResponse.success || !Array.isArray(activeDevisResponse.data)) {
            throw new Error('Failed to fetch active devis.');
        }
        const activeDevis = activeDevisResponse.data;

        // Map no_devis.ND -> ID
        if (demracData.no_devis?.ND) {
            const devis = activeDevis.find(d => d.ND === demracData.no_devis.ND);
            if (!devis) {
                throw new Error(`Devis not found for ND: ${demracData.no_devis.ND}`);
            }
            demracData.no_devis = devis.ND;
        }
        if (!demracData.no_devis || !demracData.no_devis.ND) {
            delete demracData.no_devis;
        }
        // Insert into DR table
        const { data: demrac, error: contactError } = await supabase
            .from('DR')
            .insert([{ EB_fk: EB, ...demracData }])
            .select();

        if (contactError) throw contactError;

        // Link DR with the site
        const NDR_fk = demrac[0].NDRid;
        const { error: siteDemracError } = await supabase
            .from('Site-Dr')
            .insert([{ EB_fk: EB, NDR_fk }]);

        if (siteDemracError) throw siteDemracError;

        return { success: true, data: demrac[0] };
    } catch (error) {
        console.error('Error in createDr:', error.message);
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
      const activeentitesResponse = await entityModel.getAllActiveEntites();
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
     const activepropsectsResponse = await getActiveProspects();
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
    getActiveProspects,
    getActiveDevis,
}
export default drModel ; 