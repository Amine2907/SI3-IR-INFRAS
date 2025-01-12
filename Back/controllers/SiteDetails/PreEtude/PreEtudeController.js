import preEtudeModel from "../../../models/SiteDetails/PreEtude/PreEtudeModel.js";
//Create PreEtude controlller 
const createPreEtude = async (req, res) => {
  const { Sid, preEtudeData } = req.body;
    // Validate required fields
    if (!Sid) {
      return res.status(400).json({ error: 'EB (Site identifier) is required.' });
    }
    if (!preEtudeData) {
      return res.status(400).json({ error: 'preEtudeData is required.' });
    }
  // Ensure that the 'status_validation_fk' is correctly mapped to an integer ID (if it's passed as description 
  try {
    // Call the model function to create a new PreEtude
    const result = await preEtudeModel.createPreEtude(Sid, preEtudeData);  // Pass Sid and preEtudeData to the model
    if (!result.success) {
      throw new Error(result.error);
    }
    // Return a success response with the created data
    return res.status(201).json({
      message: 'PreEtude successfully created and associated with site.',
      data: result.data,
    });
  } catch (error) {
    console.error('Error creating PreEtude:', error.message);
    return res.status(500).json({ error: 'An error occurred while creating the PreEtude.' });
  }
};
// Get all PreEtudes for a site controller 
const getAllPreEtudes = async(req,res)=>{
  const siteId = req.params.Sid;
    const result = await preEtudeModel.getAllPreEtude(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getAllPreEtudeT = async(req,res)=>{
    const proid = req.params.Proid;
      const result = await preEtudeModel.getAllPreEtudeT(proid);
      if(!result.success){
          return res.status(400).json({error:result.error});
      }
      return res.status(200).json(result.data);
  };
// Get PreEtude by its id controller 
const getPreEtudesById = async(req,res) => {
  const PreEtudeId = req.params.id;
    const result = await preEtudeModel.getPreEtudeById(PreEtudeId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
//Update PreEtude controller 
const updatePreEtude = async (req, res) => {
  try {
      // Extract PreEtude ID from URL parameters
      const preEtudeId = req.params.id;
      const updates = { ...req.body };
      console.log('--- Update PreEtude Request ---');
      console.log('PreEtude ID:', preEtudeId);
      console.log('Request Body:', updates);
      // Validate PreEtude ID
      if (!preEtudeId) {
          console.error('Error: PreEtude ID not provided');
          return res.status(400).json({ error: 'PreEtude ID is required.' });
      }
      // Validate update fields
      if (!updates || Object.keys(updates).length === 0) {
          console.error('Error: No update fields provided');
          return res.status(400).json({ error: 'No update fields provided.' });
      }
      console.log('Mapping process started for update fields');
      // Call the model to update the PreEtude
      const result = await preEtudeModel.updatePreEtude(preEtudeId, updates);
      console.log('--- Model Response ---');
      console.log('Result:', result);
      // Handle the result from the model
      if (!result.success) {
          console.error('Error from Model:', result.error);
          return res.status(400).json({ error: result.error });
      }
      // Return the updated PreEtude data
      console.log('Update Successful. Returning updated data:', result.data);
      return res.status(200).json(result.data);
  } catch (error) {
      console.error('Unexpected Error:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
  }
};  
// Desactivate PreEtude controller 
const desactivatePreEtude = async(req,res) =>{
    const preEtudeId = req.params.id ; 
    const result = await preEtudeModel.desactivatePreEtude(preEtudeId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Activate PreEtude controller 
const activatePreEtude = async(req,res)=> {
    const preEtudeId = req.params.id ; 
    const result = await preEtudeModel.activatePreEtude(preEtudeId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get active PreEtudes controller
const getActivePreEtudes = async(req,res) => {
  const siteId = req.params.Sid;
    const result = await preEtudeModel.fetchActivePreEtude(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get inactive PreEtudes controller
const getInactivePreEtudes = async(req,res) => {
  const siteId = req.params.Sid;
    const result = await preEtudeModel.fetchInactivePreEtude(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
// exporting all controller's functions
const PreEtudeController = {
    getAllPreEtudes,
    createPreEtude,
    getInactivePreEtudes,
    getActivePreEtudes,
    activatePreEtude,
    desactivatePreEtude,
    updatePreEtude,
    getPreEtudesById,
    getAllPreEtudeT,
}
export default PreEtudeController; 