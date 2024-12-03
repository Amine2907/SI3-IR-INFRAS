import declarationPrealableModel from "../../../models/SiteDetails/DP/DpModel.js";
import { etat } from "../../../models/SiteDetails/DP/DpData.js";
//Create Dp controlller 
const createDp = async (req, res) => {
  const { Proid, dpData } = req.body;
    // Validate required fields
    if (!Proid) {
      return res.status(400).json({ error: 'Proid (Dp identifier) is required.' });
    }
    if (!dpData) {
      return res.status(400).json({ error: 'dpData is required.' });
    }
  // Ensure that the 'etat_prerequis' is correctly mapped to an integer ID (if it's passed as description)
  if (dpData.etat_prerequis && typeof dpData.etat_prerequis === 'object' && dpData.etat_prerequis.EP_desc) {
    const etatID = etat[dpData.etat_prerequis.EP_desc];
    console.log("Mapped program:", dpData.etat_prerequis.EP_desc, "->", etatID);
    if (!etatID) {
      return res.status(400).json({ error: `Invalid status validation description: ${dpData.etat_prerequis.EP_desc}` });
    }
    dpData.etat_prerequis = etatID; // Update with numeric status ID
  }
  try {
    // Call the model function to create a new Dp
    const result = await declarationPrealableModel.createDp(Proid, dpData);  // Pass Proid and dpData to the model
    if (!result.success) {
      throw new Error(result.error);
    }
    // Return a success response with the created data
    return res.status(201).json({
      message: 'Dp successfully created and associated with site.',
      data: result.data,
    });
  } catch (error) {
    console.error('Error creating Dp:', error.message);
    return res.status(500).json({ error: 'An error occurred while creating the Dp.' });
  }
};
// Get all Dps for a site controller 
const getAllDps = async(req,res)=>{
  const prospectId = req.params.Proid;
    const result = await declarationPrealableModel.getAllDps(prospectId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get Dp by its id controller 
const getDpsById = async(req,res) => {
  const DpId = req.params.id;
    const result = await declarationPrealableModel.getDpById(DpId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
//Update Dp controller 
const updateDp = async (req, res) => {
  try {
      // Extract Dp ID from URL parameters
      const DpId = req.params.id;
      const updates = { ...req.body };
      console.log('--- Update Dp Request ---');
      console.log('Dp ID:', DpId);
      console.log('Request Body:', updates);
      // Validate Dp ID
      if (!DpId) {
          console.error('Error: Dp ID not provided');
          return res.status(400).json({ error: 'Dp ID is required.' });
      }
      // Validate update fields
      if (!updates || Object.keys(updates).length === 0) {
          console.error('Error: No update fields provided');
          return res.status(400).json({ error: 'No update fields provided.' });
      }
      console.log('Mapping process started for update fields');
      // Call the model to update the Dp
      const result = await declarationPrealableModel.updateDp(DpId, updates);
      console.log('--- Model Response ---');
      console.log('Result:', result);
      // Handle the result from the model
      if (!result.success) {
          console.error('Error from Model:', result.error);
          return res.status(400).json({ error: result.error });
      }
      // Return the updated Dp data
      console.log('Update Successful. Returning updated data:', result.data);
      return res.status(200).json(result.data);
  } catch (error) {
      console.error('Unexpected Error:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
  }
};
// Desactivate Dp controller 
const desactivateDp = async(req,res) =>{
    const Dpid = req.params.id ; 
    const result = await declarationPrealableModel.desactivateDp(Dpid);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Activate Dp controller 
const activateDp = async(req,res)=> {
    const Dpid = req.params.id ; 
    const result = await declarationPrealableModel.activateDp(Dpid);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get active Dps controller
const getActiveDps = async(req,res) => {
  const prospectId = req.params.Proid;
    const result = await declarationPrealableModel.fetchActiveDp(prospectId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get inactive Dps controller
const getInactiveDps = async(req,res) => {
  const prospectId = req.params.Proid;
    const result = await declarationPrealableModel.fetchInactiveDp(prospectId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
// exporting all controller's functions
const declarationPrealableController = {
    getAllDps,
    createDp,
    getInactiveDps,
    getActiveDps,
    activateDp,
    desactivateDp,
    updateDp,
    getDpsById,
}
export default declarationPrealableController ; 