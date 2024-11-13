/**
 * @author: Mohamed Amine EL BAH 
 * @description: this file contains all the controller functions for the sites feature.
 * @functions:
 * - createsite: creates a site in the database
 * - getAllsites: gets all the sites in the database with is_active = true
 * - getsitesById: gets a site by its id
 * - updatesite: updates a site in the database
 * - desactivatesite: deactivates a site in the database
 * - activatesite: activates a site in the database
 * - SearchSites: searches sites in the database
 * - getActivesites: gets all the active sites in the database
 * - getInactivesites: gets all the inactive sites in the database
 */
import siteModel from "../../models/Site/siteModel.js";
const fetchActiveCompanies = async (req, res) => {
    try {
        const result = await siteModel.getActiveCompanies();
        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return res.status(500).json({ success: false, message: result.error });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
//Create site controlller 
const createsite = async (req, res) => {
    try {
      console.log("Received data:", req.body); // Log initial request data
  
      const priorityMapping = {
        "P00": 1,
        "P0": 2,
        "P1": 3,
        "P2": 4,
      };
  
      const programMapping = {
        "4GFixe": 1,
        "DCC": 2,
        "ARP": 3,
        "DENSIF_CZ_RED": 4,
        "DENSIF_CZ": 5,
        "ZTD_RED": 6,
        "PAC-REMP": 7,
        "PAC": 8,
        "PAC-DUP": 9,
        "PAC-CONTINUITY-PLAN": 10,
        "FM": 11,
        "ORF": 12,
        "SFR TT": 13,
        "FM TT": 14,
      };
  
      const siteStatusMapping = {
        "Activé": 1,
        "Inactif": 2,
        "Terminé": 3,
      };
      // Extract and map the fields if they contain descriptions instead of IDs
      let data = { ...req.body };
      console.log("Mapping process started");
      // Map `priorite_fk` if it's an object with `SP_desc`
      if (data.priorite_fk && typeof data.priorite_fk === 'object' && data.priorite_fk.SP_desc) {
        const prioriteId = priorityMapping[data.priorite_fk.SP_desc];
        console.log("Mapped priority:", data.priorite_fk.SP_desc, "->", prioriteId);
        if (!prioriteId) {
          throw new Error(`Invalid priority description: ${data.priorite_fk.SP_desc}`);
        }
        data.priorite_fk = data.priorite_fk.SP_desc; // Map back to description
      }
      // Map `programme_fk` if it's an object with `PR_desc`
      if (data.programme_fk && typeof data.programme_fk === 'object' && data.programme_fk.PR_desc) {
        const programId = programMapping[data.programme_fk.PR_desc];
        console.log("Mapped program:", data.programme_fk.PR_desc, "->", programId);
        if (!programId) {
          throw new Error(`Invalid program description: ${data.programme_fk.PR_desc}`);
        }
        data.programme_fk = data.programme_fk.PR_desc; // Map back to description
      }
      // Map `status_site_fk` if it's an object with `SS_desc`
      if (data.status_site_fk && typeof data.status_site_fk === 'object' && data.status_site_fk.SS_desc) {
        const statusId = siteStatusMapping[data.status_site_fk.SS_desc];
        console.log("Mapped status:", data.status_site_fk.SS_desc, "->", statusId);
        if (!statusId) {
          throw new Error(`Invalid status description: ${data.status_site_fk.SS_desc}`);
        }
        data.status_site_fk = data.status_site_fk.SS_desc; // Map back to description
      }
      console.log("Transformed data ready for insertion:", data);
      // Proceed to create the site with transformed data
      const newsite = { ...data, is_active: true };
      const result = await siteModel.createSite(newsite);
      if (!result.success) {
        console.error("Error in model operation:", result.error);
        return res.status(400).json({ error: result.error });
      }
      console.log("Site created successfully:", result.result);
      return res.status(200).json(result.result);
    } catch (error) {
      console.error("Error during site creation:", error.message);
      return res.status(400).json({ error: error.message });
    }
  };  
// Get all active sites controller 
const getAllsites = async(req,res)=>{
    const result = await siteModel.getAllSites();
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get site by its id controller 
const getsitesById = async(req,res) => {
    const siteId = req.params.id ; 
    const result = await siteModel.GetsitesById(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
//Update site controller 
const updatesite = async (req, res) => {
    try {
      // Extract site ID from URL parameters
      const siteId = req.params.EB.replace(':EB=', '');
      // Extract update fields from request body
      const updates = req.body;
      console.log('--- Update site Request ---');
      console.log('site ID:', siteId); 
      console.log('Request Body:', updates);
      // Ensure the site ID is provided
      if (!siteId) {
        console.error('Error: site ID not provided');
        return res.status(400).json({ error: 'site ID is required.' });
      }
      // Ensure updates contain necessary fields (optional validation)
      if (!updates || Object.keys(updates).length === 0) {
        console.error('Error: No update fields provided');
        return res.status(400).json({ error: 'No update fields provided.' });
      }
      // Call the model to update the site
      const result = await siteModel.updateSite(siteId, updates);
      console.log('--- Model Response ---');
      console.log('Result:', result);
  
      // Handle the result from the model
      if (!result.success) {
        console.error('Error from Model:', result.error);
        return res.status(400).json({ error: result.error });
      }
      // Return the updated site data
      console.log('Update Successful. Returning updated data:', result.data);
      return res.status(200).json(result.data);
    } catch (error) {
      // Catch unexpected errors
      console.error('Unexpected Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
// Desactivate site controller 
const desactivateSite = async(req,res) =>{
    const siteId = req.params.id ; 
    const result = await siteModel.desactivateSite(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Activate site controller 
const activateSite = async(req,res)=> {
    const siteId = req.params.id ; 
    const result = await siteModel.activateSite(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getActivesites = async(req,res) => {
    const result = await siteModel.getAllActivesites();
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getInactivesites = async(req,res) => {
    const result = await siteModel.getAllInactivesites();
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
// Search sites controller 
const SearchSites = async(req,res) => {
    const filters = req.query ;
    const result = await siteModel.SearchSite(filters); 
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const siteController = {
    fetchActiveCompanies,
    createsite,
    getAllsites,
    getsitesById,
    updatesite,
    desactivateSite,
    activateSite,
    SearchSites,
    getActivesites,
    getInactivesites,
}
export default siteController ; 