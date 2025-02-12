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
import {priorityMapping, programMapping, siteStatusMapping} from '../../controllers/Site/SiteData.js';
const getActiveCompanies = async () => {
    try {
        const { data, error } = await supabase
            .from('Entreprise')
            .select('ENTid, nom')
            .eq('is_active', true);
        if (error) {
            throw new Error(`Error fetching active companies: ${error.message}`);
        }
        return {success:true , data};
    } catch (error) {
        console.error(error);
        return [];
    }
};
//Create site
const createSite = async (data) => {
    try {
        // Fetch active companies list
        const activeCompaniesResponse = await getActiveCompanies();
        // Log the response to ensure it's correct
        console.log('Active Companies Response:', activeCompaniesResponse);
        // Check if the response is successful and if the data is an array
        if (!activeCompaniesResponse.success) {
            throw new Error('Failed to fetch active companies');
        }
        const activeCompanies = activeCompaniesResponse.data;
        if (!Array.isArray(activeCompanies)) {
            throw new Error('Active companies data is not an array.');
        }
        if (activeCompanies.length === 0) {
            throw new Error('No active companies found');
        }
        // Log the incoming data to inspect Acteur_ENEDIS_id
        console.log('Incoming data for createSite:', data);

        // If Acteur_ENEDIS_id is a string (company name), convert it to the corresponding company ID
        if (typeof data.Acteur_ENEDIS_id === 'string') {
            const companyName = data.Acteur_ENEDIS_id;
            console.warn('Converting company name to company ID:', companyName);

            // Find the company in the activeCompanies list based on company name
            const company = activeCompanies.find(company => company.nom === companyName);

            if (company) {
                // Replace the company name with the corresponding company ID
                data.Acteur_ENEDIS_id = company.ENTid;
            } else {
                throw new Error(`No company found with name: ${companyName}`);
            }
        }
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
        // Insert data into the database
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
      // Fetch active companies list (if necessary for mapping)
      const activeCompaniesResponse = await getActiveCompanies();
      console.log('Active Companies Response:', activeCompaniesResponse);
  
      if (!activeCompaniesResponse.success) {
        throw new Error('Failed to fetch active companies');
      }
      const activeCompanies = activeCompaniesResponse.data;
      if (!Array.isArray(activeCompanies)) {
        throw new Error('Active companies data is not an array.');
      }
  
      console.log('Incoming updates for updateSite:', updates);
  
      // Handle Acteur_ENEDIS_id conversion (if provided as a name)
      if (updates.Acteur_ENEDIS_id && typeof updates.Acteur_ENEDIS_id === 'string') {
        const companyName = updates.Acteur_ENEDIS_id;
        const company = activeCompanies.find(company => company.nom === companyName);
        if (company) {
          updates.Acteur_ENEDIS_id = company.ENTid;
        } else {
          throw new Error(`No company found with name: ${companyName}`);
        }
      }
  
      // Check and map `priorite_fk` only if it's not already a valid ID
      if (updates.priorite_fk) {
        if (typeof updates.priorite_fk === 'string') {
          const prioriteId = priorityMapping[updates.priorite_fk];
          if (!prioriteId) {
            throw new Error(`Invalid priority description: ${updates.priorite_fk}`);
          }
          updates.priorite_fk = prioriteId;
        } else if (typeof updates.priorite_fk === 'number') {
          console.log('priorite_fk is already an ID:', updates.priorite_fk);
        } else {
          throw new Error(`Invalid structure for priorite_fk: ${updates.priorite_fk}`);
        }
      }
  
      // Check and map `programme_fk` only if it's not already a valid ID
      if (updates.programme_fk) {
        if (typeof updates.programme_fk === 'string') {
          const programId = programMapping[updates.programme_fk];
          if (!programId) {
            throw new Error(`Invalid program description: ${updates.programme_fk}`);
          }
          updates.programme_fk = programId;
        } else if (typeof updates.programme_fk === 'number') {
          console.log('programme_fk is already an ID:', updates.programme_fk);
        } else {
          throw new Error(`Invalid structure for programme_fk: ${updates.programme_fk}`);
        }
      }
  
      // Check and map `status_site_fk` only if it's not already a valid ID
      if (updates.status_site_fk) {
        if (typeof updates.status_site_fk === 'string') {
          const statusId = siteStatusMapping[updates.status_site_fk];
          if (!statusId) {
            throw new Error(`Invalid status description: ${updates.status_site_fk}`);
          }
          updates.status_site_fk = statusId;
        } else if (typeof updates.status_site_fk === 'number') {
          console.log('status_site_fk is already an ID:', updates.status_site_fk);
        } else {
          throw new Error(`Invalid structure for status_site_fk: ${updates.status_site_fk}`);
        }
      }
  
      console.log('Transformed updates ready for database operation:', updates);
  
      // Perform the update operation in the database
      const { data, error } = await supabase
        .from('Site')
        .update(updates)
        .eq('EB', EB);
  
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
            query = query
                .filter('Operateurs', 'cs', `{${filters.Operateurs}}`);
        }
        // Convert the 'programme_fk' description to its numeric ID if provided
        if (filters.programme_fk) {
            const programId = programMapping[filters.programme_fk];
            if (programId) {
                query = query.eq('programme_fk', programId);  // Using numeric ID in the query
            }
        }
        // Convert 'Acteur_ENEDIS_id' to company name if it is a numeric ID
        if (filters.Acteur_ENEDIS_id) {
            const acteurName = Object.keys(idToNameMap).find(name => idToNameMap[name] == filters.Acteur_ENEDIS_id);
            if (acteurName) {
                // Filter the query by the company name
                query = query.eq('Acteur_ENEDIS_id', idToNameMap[acteurName]);
            } else {
                return { success: false, error: "No active company found with this ID." };  // If no matching name
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
        return { success: true, data };

    } catch (error) {
        return { success: false, error: error.message };
    }
};
const getDpData = async (Sid) => {
    try {
        const {data,error} = await supabase
        .from('DP')
        .select('status_go_traveauxR')
        .eq('EB_fk',Sid);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
}
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
    getActiveCompanies,
    getDpData,
}
export default siteModel; 