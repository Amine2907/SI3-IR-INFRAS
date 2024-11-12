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
//Create site controlller 
const createsite = async(req,res) =>{
    const newsite = {...req.body,is_active:true};
    const result = await siteModel.createSite(newsite);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.result);
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