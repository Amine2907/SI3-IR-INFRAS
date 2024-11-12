/**
 * This file contains the model for the sites feature.
 * It provides functions to interact with the supabase instance.
 * The functions are:
 * - createsite: creates a site in the database
 * - getAllsites: gets all the sites in the database
 * - getsiteById: gets a site by its ID
 * - updateSite: updates a site in the database
 * - deactivateSite: deactivates a site in the database
 * - activateSite: activates a site in the database
 * - SearchSites: searches sites in the database
 * - getActivesites: gets all the active sites in the database
 * - getInactivesites: gets all the inactive sites in the database
 */
import { supabase } from "../../config/supabaseClient.js";
//Create site 
const createSite = async (data) => {
    try {
        const priorityMapping = {
            "P00" : 1 , 
            "P0" : 2 , 
            "P1" : 3 ,
            "P2" : 4 ,
        };
        const programMapping = {
            "4GFixe" : 1 , 
            "DCC" : 2 , 
            "ARP" : 3 , 
            "DENSIF_CZ_RED" : 4 ,
            "DENSIF_CZ" : 5 , 
            "ZTD_RED" : 6 , 
            "PAC-REMP" : 7 ,
            "PAC" : 8 , 
            "PAC-DUP" : 9 ,
            "PAC-CONTINUITY-PLAN" : 10 ,
            "FM" : 11 , 
            "ORF" : 12 , 
            "SFR TT" : 13 , 
            "FM TT" : 14 ,
        };
        const siteStatusMapping  = {
            "Activé" : 1 ,
            "Inactif" : 2 , 
            "Terminé" : 3 ,
        };
         // Check and map priorite_fk, programme_fk, and status_site_fk to their corresponding IDs
         if (data.priorite_fk) {
            const prioriteId = priorityMapping[data.priorite_fk];
            if (!prioriteId) {
                throw new Error(`Invalid priority description: ${data.priorite_fk}`);
            }
            data.priorite_fk = prioriteId;
        }

        if (data.programme_fk) {
            const programId = programMapping[data.programme_fk];
            if (!programId) {
                throw new Error(`Invalid program description: ${data.programme_fk}`);
            }
            data.programme_fk = programId;
        }
        if (data.status_site_fk) {
            const statusId = siteStatusMapping[data.status_site_fk];
            if (!statusId) {
                throw new Error(`Invalid status description: ${data.status_site_fk}`);
            }
            data.status_site_fk = statusId;
        }
        const { data: result, error } = await supabase
            .from('Site')
            .insert([data]);
        if (error) {
            throw error;
        }
        return { success: true, result };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
//GetAllsites 
const getAllSites = async() => {
    try {
        const {data,error} = await supabase
        .from('Site')
        // depends on use i will decide if im gonna use the query or not 
        .select(`
            * ,
            priorite_fk:Site-priorite(SP_desc),
            programme_fk:Programme(PR_desc),
            status_site_fk:Site-status(SS_desc),
            Acteur_ENEDIS_id:Entreprise(nom)
            `)
            .eq('Entreprise.is_active', true);
        if(error){
            throw error;
        }
        return {success:true , data};
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// Get all active companies for the Acteur Enedis dropdown
const getActiveCompaniesForActeurEnedis = async () => {
    try {
        const { data, error } = await supabase
            .from('Entreprise')
            .select('nom')
            .eq('is_active', true);
        if (error) {
            throw error;
        }
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// Get all active sites
const getAllActivesites = async() => {
    try {
        const {data,error} = await supabase
        .from('Site')
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
const getAllInactivesites = async() => {
    try {
        const {data,error} = await supabase
        .from('Site')
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
//GetsitesById 
const GetsitesById = async(EB) => {
    try {
        const {data,error} = await supabase
        .from('Site')
        .select('*')
        .eq('EB',EB);
        if(error){
            throw error ;
        }
        return {success:true , data };
    }catch(error){
        return {success:false ,error:error.messsage};
    }
};
//Update sites 
const updateSite = async (EB, updates) => {
    try {
      const { data, error } = await supabase
        .from('Site')
        .update(updates)
        .eq('EB', EB);
      if (error) {
        console.error('Supabase Error:', error); // Log the error
        return { success: false, error: error.message }; // Pass the actual error message
      }
      return { success: true, data }; // Return success with data
    } catch (err) {
      console.error('Catch Block Error:', err); // Log any unexpected errors
      return { success: false, error: err.message }; // Return the caught error message
    }
  };
// Activate sites 
const activateSite = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Site')
        .update({is_active:true})
        .eq('EB',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// Desactivate sites
const desactivateSite = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Site')
        .update({is_active:false})
        .eq('EB',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// Search sites 
const SearchSite = async (filters) => {
    console.log("Received filters:", filters);
    try {
        // Mappings for converting human-readable descriptions to IDs
        const priorityMapping = {
            "P00" : 1 , 
            "P0" : 2 , 
            "P1" : 3 ,
            "P2" : 4 ,
        };

        const programMapping = {
            "4GFixe" : 1 , 
            "DCC" : 2 , 
            "ARP" : 3 , 
            "DENSIF_CZ_RED" : 4 ,
            "DENSIF_CZ" : 5 , 
            "ZTD_RED" : 6 , 
            "PAC-REMP" : 7 ,
            "PAC" : 8 , 
            "PAC-DUP" : 9 ,
            "PAC-CONTINUITY-PLAN" : 10 ,
            "FM" : 11 , 
            "ORF" : 12 , 
            "SFR TT" : 13 , 
            "FM TT" : 14 ,
        };
        const siteStatusMapping  = {
            "Activé" : 1 ,
            "Inactif" : 2 , 
            "Terminé" : 3 ,
        };
                // Query active company names and IDs from Acteur_ENEDIS table
        const { data: acteurData, error: acteurError } = await supabase
        .from('Entreprise')
        .select('ENTid, nom');
        if (acteurError) throw acteurError;
    
        // Create a mapping from ID to company name
        const idToNameMap = acteurData.reduce((acc, { ENTid, nom }) => {
            acc[nom] = ENTid;
             return acc;
        }, {});
        // Initialize the query with the table 'Site'
        let query = supabase.from('Site').select('*');
        // Filter by EB
        if (filters.EB) {
            query = query.ilike('EB', `%${filters.EB}%`);
        }
        // Filter by G2R
        if (filters.G2R) {
            query = query.ilike('G2R', filters.G2R);
        }
        // Filter by nom (name of the site)
        if (filters.nom) {
            query = query.ilike('nom', `%${filters.nom}%`);
        }
        // Filter by code_postal
        if (filters.code_postal) {
            query = query.eq('code_postal', filters.code_postal);
        }
        // Filter by Ville (City)
        if (filters.Ville) {
            query = query.ilike('Ville', `%${filters.Ville}%`);
        }
        // Filter by region
        if (filters.region) {
            query = query.ilike('region', `%${filters.region}%`);
        }
        // Filter by Operateurs
        if (filters.Operateurs) {
            query = query.ilike('Operateurs', `%${filters.Operateurs}%`);
        }
        // Convert the 'programme_fk' description to its numeric ID if provided
        if (filters.programme_fk) {
            const programId = programMapping[filters.programme_fk];
            if (programId) {
                query = query.eq('programme_fk', programId);  // Using numeric ID in the query
            }
        }
        if (filters.Acteur_ENEDIS_id) {
            const acteurId = nameToIdMap[filters.Acteur_ENEDIS_id];
            if (acteurId) {
                query = query.eq('Acteur_ENEDIS_id', acteurId);  // Use the mapped ENTid to filter
            } else {
                return { success: false, error: "No active company found with this name." };  // If the name doesn't match any active company
            }
        }
        // Convert the 'status_site_fk' description to its numeric ID if provided
        if (filters.status_site_fk) {
            const statusId = siteStatusMapping[filters.status_site_fk];
            if (statusId) {
                query = query.eq('status_site_fk', statusId);  // Using numeric ID in the query
            }
        }
        // Convert the 'priorite_fk' description to its numeric ID if provided
        if (filters.priorite_fk) {
            const priorityId = priorityMapping[filters.priorite_fk];
            if (priorityId) {
                query = query.eq('priorite_fk', priorityId);  // Using numeric ID in the query
            }
        }
        // Filter by status_site_SFR
        if (filters.status_site_SFR) {
            query = query.ilike('status_site_SFR', `%${filters.status_site_SFR}%`);
        }
        // Execute the query and handle the result
        const { data, error } = await query;
        if (error) {
            throw error;
        }
        // const resultWithNames = data.map(item => ({
        //     ...item,
        //     Acteur_ENEDIS_name: idToNameMap[item.Acteur_ENEDIS_id] || null,  // Add company name based on the ID
        // }));
        return { success: true, data  };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
const siteModel = {
    createSite,
    getAllSites,
    GetsitesById,
    updateSite,
    activateSite,
    desactivateSite,
    getAllActivesites,
    getAllInactivesites,
    SearchSite,
    getActiveCompaniesForActeurEnedis,
}
export default siteModel ; 