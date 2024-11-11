/**
 * This file contains the model for the sites feature.
 * It provides functions to interact with the supabase instance.
 * The functions are:
 * - createsite: creates a site in the database
 * - getAllsites: gets all the sites in the database
 * - getsiteById: gets a site by its ID
 * - updatesite: updates a site in the database
 * - deactivatesite: deactivates a site in the database
 * - activatesite: activates a site in the database
 * - searchsites: searches sites in the database
 * - getActivesites: gets all the active sites in the database
 * - getInactivesites: gets all the inactive sites in the database
 */
import { supabase } from "../../config/supabaseClient.js";
//Create site 
const createsite = async (data) => {
    try {
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
const getAllsites = async() => {
    try {
        const {data,error} = await supabase
        .from('Site')
        // depends on use i will decide if im gonna use the query or not 
        // .select(`
        //     EB , 
        //     G2R ,
        //     nom,
        //     Ville,
        //     zone,
        //     region,
        //     lot,
        //     commentaires,
        //     Operateurs,
        //     is_active,
        //     code_postal,
        //     status_site_SFR,
        //     priorite_fk:Site_priorite(SPid,SP_desc),
        //     programme_fk:Programme(PRid,PR_desc),
        //     status_site_fk:Site-status(SSid,SS_desc),
        //     Acteur_ENEDIS_id:Entreprise(ENTid,nom)
        //     `)
        //     .eq('Entreprise.is_active', true);
        .select('*');
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
            .select('ENTid, nom')
            .eq('is_active', true); // Fetch only active companies

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
const updatesite = async (EB, updates) => {
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
const activatesite = async(id) => {
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
const desactivatesite = async(id) => {
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
const Searchsite = async (filters) => {
    console.log("Received filters:", filters);
    try {
        let query = supabase
            .from('Site')
            // .select(`
            //     *,
            //     programme_fk:Programme(PR_desc),
            //     Acteur_ENEDIS_id:Entreprise(nom),
            //     status_site_fk:Site-status(SS_desc)
            // `);
            .select('*');
        // filter by EB 
        if (filters.EB) {
            query = query.ilike('EB', `%${filters.EB}%`);
        }
        // filter by G2R
        if (filters.G2R) {
            query = query.ilike('G2R', filters.G2R);
        }
        // filter by nom 
        if (filters.nom) {
            query = query.ilike('nom', `%${filters.nom}%`);
        }
        // filter by code_postal 
        if (filters.code_postal) {
            query = query.eq('code_postal', filters.code_postal);
        }
        // filter by ville 
        if (filters.Ville) {
            query = query.ilike('Ville', `%${filters.Ville}%`);
        }
        // filter by region 
        if (filters.region) {
            query = query.ilike('region', `%${filters.region}%`);
        }
        // filter by operateur 
        if (filters.Operateurs) {
            query = query.ilike('Operateurs', `%${filters.Operateurs}%`);
        }
        // search by programme description (PR_desc)
        // if (filters.programme_fk) {
        //     query = query.ilike('programme_fk.PR_desc', `%${filters.programme_fk}%`);
        // }
        // search by acteur enedis name (nom)
        // if (filters.Acteur_ENEDIS_id) {
        //     query = query.ilike('Acteur_ENEDIS_id.nom', `%${filters.Acteur_ENEDIS_id}%`);
        // }
        // // search by status description (SS_desc)
        // if (filters.status_site_fk) {
        //     query = query.ilike('status_site_fk.SS_desc', `%${filters.status_site_fk}%`);
        // }
        // search by status_site_SFR 
        if (filters.status_site_SFR) {
            query = query.ilike('status_site_SFR', `%${filters.status_site_SFR}%`);
        }
        const { data, error } = await query;
        if (error) {
            throw error;
        }
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
const siteModel = {
    createsite,
    getAllsites,
    GetsitesById,
    updatesite,
    activatesite,
    desactivatesite,
    getAllActivesites,
    getAllInactivesites,
    Searchsite,
}
export default siteModel ; 