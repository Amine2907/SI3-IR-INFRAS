/**
 * @author: Mohamed Amine EL BAH 
 * @description: this file contains all the controller functions for the drs feature.
 * @functions:
 * - createDr: creates a dr in the database
 * - getAlldrs: gets all the drs in the database with is_active = true
 * - getdrsById: gets a dr by its id
 * - updatedr: updates a dr in the database
 * - desactivatedr: deactivates a dr in the database
 * - activatedr: activates a dr in the database
 * - Searchdrs: searches drs in the database
 * - getActivedrs: gets all the active drs in the database
 * - getInactivedrs: gets all the inactive drs in the database
 */
import drModel from "../../../models/SiteDetails/DR/DrModel.js";
const fetchActiveProspects = async (req,res) => {
    const siteId = req.params.Sid;
    try {
        const result = await drModel.getActiveProspects(siteId);
        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return res.status(500).json({ success: false, message: result.error });
        }
    } catch(error){
        return res.status(500).json({ success: false, message: error.message });
    }
};
const fetchActiveDevis = async (req,res) => {
    const siteId = req.params.Sid;
    try {
        const result = await drModel.getActiveDevis(siteId);
        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return res.status(500).json({ success: false, message: result.error });
        }
    } catch(error){
        return res.status(500).json({ success: false, message: error.message });
    }
};
//Create dr controlller 
const createDr = async (req, res) => {
    const { Sid, demracData } = req.body;
    // Validate required fields
    if (!Sid) {
        return res.status(400).json({ error: 'EB (Site identifier) is required.' });
      }
      if (!demracData) {
        return res.status(400).json({ error: 'demRacData is required.' });
      }
    try {
        const result = await drModel.createDr(Sid,demracData)
      if (!result.success) {
        console.error("Error in model operation:", result.error);
        return res.status(400).json({ error: result.error });
      }
    // Return a success response with the created data
    return res.status(201).json({
        message: 'DR successfully created and associated with site.',
        data: result.data,
      });
    } catch (error) {
      console.error('Error creating DR:', error.message);
      return res.status(500).json({ error: 'An error occurred while creating the prospect.' });
    }
  };
// Get all active drs controller 
const getAlldrs = async(req,res)=>{
    const siteId = req.params.Sid;
    const result = await drModel.getAllDrs(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get dr by its id controller 
const getdrsById = async(req,res) => {
  const drId = req.params.id;
    const result = await drModel.getDrsById(drId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
//Update dr controller 
const updatedr = async (req, res) => {
  try {
    // Extract dr ID from URL parameters
    const drId = req.params.id;
    let updates = { ...req.body };
    console.log('--- Update dr Request ---');
    console.log('dr ID:', drId);
    console.log('Request Body:', updates);
    // Validate dr ID
    if (!drId) {
      console.error('Error: dr ID not provided');
      return res.status(400).json({ error: 'dr ID is required.' });
    }
    // Validate update fields
    if (!updates || Object.keys(updates).length === 0) {
      console.error('Error: No update fields provided');
      return res.status(400).json({ error: 'No update fields provided.' });
    }
    console.log('Transformed update fields:', updates);
    // Call the model to update the dr
    const result = await drModel.updateDr(drId, updates);
    console.log('--- Model Response ---');
    console.log('Result:', result);
    // Handle the result from the model
    if (!result.success) {
      console.error('Error from Model:', result.error);
      return res.status(400).json({ error: result.error });
    }
    // Return the updated dr data
    console.log('Update Successful. Returning updated data:', result.data);
    return res.status(200).json(result.data);

  } catch (error) {
    // Catch unexpected errors
    console.error('Unexpected Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
// Desactivate dr controller 
const desactivateDr = async(req,res) =>{
    const drId = req.params.id ; 
    const result = await drModel.desactivateDr(drId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Activate dr controller 
const activateDr = async(req,res)=> {
    const drId = req.params.id ; 
    const result = await drModel.activateDr(drId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getAllActiveDrs = async(req,res) => {
    const siteId = req.params.Sid ; 
    const result = await drModel.getAllActiveDrs(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getAllInactiveDrs = async(req,res) => {
    const siteId = req.params.Sid ; 
    const result = await drModel.getAllInactiveDrs(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
// Search drs controller 
const demRacController = {
    fetchActiveProspects,
    fetchActiveDevis,
    createDr,
    getAlldrs,
    getdrsById,
    updatedr,
    desactivateDr,
    activateDr,
    getAllActiveDrs,
    getAllInactiveDrs
}
export default demRacController ; 