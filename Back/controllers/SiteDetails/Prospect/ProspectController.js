import prospectModel from "../../../models/SiteDetails/Prospect/ProspectModel.js";
import { status_validation } from "../../../models/SiteDetails/Prospect/ProspectData.js";
//Create prospect controlller 
const createProspect = async (req, res) => {
  const { Sid, prospectData } = req.body;
  // Ensure that the 'status_validation_fk' is correctly mapped to an integer ID (if it's passed as description)
  if (prospectData.status_validation_fk && typeof prospectData.status_validation_fk === 'object' && prospectData.status_validation_fk.SV_desc) {
    const statusID = status_validation[prospectData.status_validation_fk.SV_desc];
    console.log("Mapped program:", prospectData.status_validation_fk.SV_desc, "->", statusID);
    if (!statusID) {
      return res.status(400).json({ error: `Invalid status validation description: ${prospectData.status_validation_fk.SV_desc}` });
    }
    prospectData.status_validation_fk = statusID; // Update with numeric status ID
  }
  // Validate required fields
  if (!Sid) {
    return res.status(400).json({ error: 'EB (Site identifier) is required.' });
  }
  if (!prospectData) {
    return res.status(400).json({ error: 'prospectData is required.' });
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
const getAllProspects = async(req,res)=>{
    const result = await prospectModel.getAllProspects();
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get prospect by its id controller 
const getprospectsById = async(req,res) => {
  const prospectId = req.params.PRoid;
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
    const prospectId = req.params.Proid;
    let updates = { ...req.body }; // Extract update fields from request body
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

    // Handle mapping for `priorite_fk`
    if (updates.status_validation_fk) {
      if (typeof updates.status_validation_fk === 'object' && updates.status_validation_fk.SV_desc) {
        const statusId = status_validation[updates.status_validation_fk.SV_desc];
        if (!statusId) {
          throw new Error(`Invalid priority description: ${updates.priorite_fk.SP_desc}`);
        }
        updates.status_validation_fk = statusId; // Map to ID
      } else if (typeof updates.status_validation_fk === 'string' || typeof updates.status_validation_fk === 'number') {
        console.log('status already mapped:', updates.status_validation_fk);
      } else {
        console.error('Invalid status_validation_fk structure:', updates.status_validation_fk);
        throw new Error('Invalid status structure');
      }
    }
    console.log('Transformed update fields:', updates);
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
    // Catch unexpected errors
    console.error('Unexpected Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
// Desactivate prospect controller 
const desactivateProspect = async(req,res) =>{
    const prospectid = req.params.Proid ; 
    const result = await prospectModel.desactivateProspect(prospectid);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Activate prospect controller 
const activateProspect = async(req,res)=> {
    const prospectid = req.params.Proid ; 
    const result = await prospectModel.activateprospect(prospectid);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getActiveProspects = async(req,res) => {
    const result = await prospectModel.fetchActiveProspect();
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getInactiveProspects = async(req,res) => {
    const result = await prospectModel.fetchinactiveProspect();
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
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