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
import { supabase } from "../../config/supabaseClient.js";
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
const getActiveProspects = async () => {
    try {
        const { data, error } = await supabase
            .from('Prospect')
            .select('Proid, nom')
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
        // Check and map SPRid_FK, programme_fk, and status_Dr_fk to their corresponding IDs
        if (data.SPRid_FK) {
            const statpropId = statusPropmapping[data.SPRid_FK];
            if (!statpropId) {
                throw new Error(`Invalid priority description: ${data.SPRid_FK}`);
            }
            data.SPRid_FK = statpropId;
        }
        if (data.programme_fk) {
            const programId = programMapping[data.programme_fk];
            if (!programId) {
                throw new Error(`Invalid program description: ${data.programme_fk}`);
            }
            data.programme_fk = programId;
        }
        if (data.status_Dr_fk) {
            const statusId = DrStatusMapping[data.status_Dr_fk];
            if (!statusId) {
                throw new Error(`Invalid status description: ${data.status_Dr_fk}`);
            }
            data.status_Dr_fk = statusId;
        }
        // Insert data into the database
        const { data: result, error } = await supabase
            .from('Dr')
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
        .from('Dr')
        // depends on use i will decide if im gonna use the query or not 
        .select(`
            * ,
            SPRid_FK:Dr-priorite(SP_desc),
            programme_fk:Programme(PR_desc),
            status_Dr_fk:Dr-status(SS_desc),
            gestionnaire_de_reseau:Entreprise(nom)
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
// Get all active Drs
const getAllActiveDrs = async() => {
    try {
        const {data,error} = await supabase
        .from('Dr')
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
        .from('Dr')
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
const GetDrsById = async(EB) => {
    try {
        const {data,error} = await supabase
        .from('Dr')
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
//Update Drs 
const updateDr = async (EB, updates) => {
    try {
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
  
      // Check and map `SPRid_FK` only if it's not already a valid ID
      if (updates.SPRid_FK) {
        if (typeof updates.SPRid_FK === 'string') {
          const statpropId = statusPropmapping[updates.SPRid_FK];
          if (!statpropId) {
            throw new Error(`Invalid priority description: ${updates.SPRid_FK}`);
          }
          updates.SPRid_FK = statpropId;
        } else if (typeof updates.SPRid_FK === 'number') {
          console.log('SPRid_FK is already an ID:', updates.SPRid_FK);
        } else {
          throw new Error(`Invalid structure for SPRid_FK: ${updates.SPRid_FK}`);
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
  
      // Check and map `status_Dr_fk` only if it's not already a valid ID
      if (updates.status_Dr_fk) {
        if (typeof updates.status_Dr_fk === 'string') {
          const statusId = DrStatusMapping[updates.status_Dr_fk];
          if (!statusId) {
            throw new Error(`Invalid status description: ${updates.status_Dr_fk}`);
          }
          updates.status_Dr_fk = statusId;
        } else if (typeof updates.status_Dr_fk === 'number') {
          console.log('status_Dr_fk is already an ID:', updates.status_Dr_fk);
        } else {
          throw new Error(`Invalid structure for status_Dr_fk: ${updates.status_Dr_fk}`);
        }
      }
  
      console.log('Transformed updates ready for database operation:', updates);
  
      // Perform the update operation in the database
      const { data, error } = await supabase
        .from('Dr')
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
// Activate Drs 
const activateDr = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Dr')
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
// Desactivate Drs
const desactivateDr = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Dr')
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
// Search Drs 
const SearchDr = async (filters) => {
    console.log("Received filters:", filters);
    try {
        // Query active entite names and IDs from Acteur_ENEDIS table
        const { data: acteurData, error: acteurError } = await supabase
            .from('Entreprise')
            .select('Eid, nom');
        if (acteurError) throw acteurError;

        // Create a mapping from ID to entite name
        const idToNameMap = acteurData.reduce((acc, { Eid, nom }) => {
            acc[nom] = Eid;
            return acc;
        }, {});
        // Initialize the query with the table 'Dr'
        let query = supabase.from('Dr').select('*');

        // Filter by EB
        if (filters.EB) {
            query = query.ilike('EB', `%${filters.EB}%`);
        }
        // Filter by G2R
        if (filters.G2R) {
            query = query.ilike('G2R', filters.G2R);
        }
        // Filter by nom (name of the Dr)
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
        // Convert 'gestionnaire_de_reseau' to entite name if it is a numeric ID
        if (filters.gestionnaire_de_reseau) {
            const acteurName = Object.keys(idToNameMap).find(name => idToNameMap[name] == filters.gestionnaire_de_reseau);
            if (acteurName) {
                // Filter the query by the entite name
                query = query.eq('gestionnaire_de_reseau', idToNameMap[acteurName]);
            } else {
                return { success: false, error: "No active entite found with this ID." };  // If no matching name
            }
        }
        // Convert the 'status_Dr_fk' description to its numeric ID if provided
        if (filters.status_Dr_fk) {
            const statusId = DrStatusMapping[filters.status_Dr_fk];
            if (statusId) {
                query = query.eq('status_Dr_fk', statusId);  // Using numeric ID in the query
            }
        }
        // Convert the 'SPRid_FK' description to its numeric ID if provided
        if (filters.SPRid_FK) {
            const priorityId = statusPropmapping[filters.SPRid_FK];
            if (priorityId) {
                query = query.eq('SPRid_FK', priorityId);  // Using numeric ID in the query
            }
        }
        // Filter by status_Dr_SFR
        if (filters.status_Dr_SFR) {
            query = query.ilike('status_Dr_SFR', `%${filters.status_Dr_SFR}%`);
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
const drModel = {
    createDr,
    getAllDrs,
    GetDrsById,
    updateDr,
    activateDr,
    desactivateDr,
    getAllActiveDrs,
    getAllInactiveDrs,
    SearchDr,
    getActiveEntites,
}
export default drModel ; 