import prospectModel from "../../../models/SiteDetails/Prospect/ProspectModel.js";
import { status_validation } from "../../../models/SiteDetails/Prospect/ProspectData.js";
//Create prospect controlller 
const createProspect = async (req, res) => {
  const { Sid, prospectData } = req.body;
    // Validate required fields
    if (!Sid) {
      return res.status(400).json({ error: 'EB (Site identifier) is required.' });
    }
    if (!prospectData) {
      return res.status(400).json({ error: 'prospectData is required.' });
    }
  // Ensure that the 'status_validation_fk' is correctly mapped to an integer ID (if it's passed as description)
  if (prospectData.status_validation_fk && typeof prospectData.status_validation_fk === 'object' && prospectData.status_validation_fk.SV_desc) {
    const statusID = status_validation[prospectData.status_validation_fk.SV_desc];
    console.log("Mapped program:", prospectData.status_validation_fk.SV_desc, "->", statusID);
    if (!statusID) {
      return res.status(400).json({ error: `Invalid status validation description: ${prospectData.status_validation_fk.SV_desc}` });
    }
    prospectData.status_validation_fk = statusID; // Update with numeric status ID
  }
  try {
    // Call the model function to create a new prospect
    const result = await prospectModel.createProspect(Sid, prospectData);  // Pass Sid and prospectData to the model
    if (!result.success) {
      throw new Error(result.error);
    }
    // Return a success response with the created data
    return res.status(201).json({
      message: 'Prospect successfully created and associated with site.',
      data: result.data,
    });
  } catch (error) {
    console.error('Error creating prospect:', error.message);
    return res.status(500).json({ error: 'An error occurred while creating the prospect.' });
  }
};
// Get all prospects for a site controller 
const getAllProspects = async(req,res)=>{
  const siteId = req.params.Sid;
    const result = await prospectModel.getAllProspects(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get prospect by its id controller 
const getprospectsById = async(req,res) => {
  const prospectId = req.params.id;
    const result = await prospectModel.getProspectById(prospectId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
//Update prospect controller 
const updateprospect = async (req, res) => {
  try {
      // Extract prospect ID from URL parameters
      const prospectId = req.params.id;
      const updates = { ...req.body };
      console.log('--- Update prospect Request ---');
      console.log('prospect ID:', prospectId);
      console.log('Request Body:', updates);
      // Validate prospect ID
      if (!prospectId) {
          console.error('Error: prospect ID not provided');
          return res.status(400).json({ error: 'prospect ID is required.' });
      }
      // Validate update fields
      if (!updates || Object.keys(updates).length === 0) {
          console.error('Error: No update fields provided');
          return res.status(400).json({ error: 'No update fields provided.' });
      }
      console.log('Mapping process started for update fields');
      // Call the model to update the prospect
      const result = await prospectModel.updateProspect(prospectId, updates);
      console.log('--- Model Response ---');
      console.log('Result:', result);
      // Handle the result from the model
      if (!result.success) {
          console.error('Error from Model:', result.error);
          return res.status(400).json({ error: result.error });
      }
      // Return the updated prospect data
      console.log('Update Successful. Returning updated data:', result.data);
      return res.status(200).json(result.data);
  } catch (error) {
      console.error('Unexpected Error:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
  }
};
// Desactivate prospect controller 
const desactivateProspect = async(req,res) =>{
    const prospectid = req.params.id ; 
    const result = await prospectModel.desactivateProspect(prospectid);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Activate prospect controller 
const activateProspect = async(req,res)=> {
    const prospectid = req.params.id ; 
    const result = await prospectModel.activateprospect(prospectid);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get active prospects controller
const getActiveProspects = async(req,res) => {
  const siteId = req.params.Sid;
    const result = await prospectModel.fetchActiveProspect(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get inactive prospects controller
const getInactiveProspects = async(req,res) => {
  const siteId = req.params.Sid;
    const result = await prospectModel.fetchInactiveProspect(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
// exporting all controller's functions
const prospectController = {
    getAllProspects,
    createProspect,
    getInactiveProspects,
    getActiveProspects,
    activateProspect,
    desactivateProspect,
    updateprospect,
    getprospectsById,
}
export default prospectController ; 