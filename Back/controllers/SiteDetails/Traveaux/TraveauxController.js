import traveauxModel from "../../../models/SiteDetails/Traveaux/TraveauxModel.js";
//Create Traveaux controlller 
const createTraveau = async (req, res) => {
    const { Sid, traveauxData } = req.body;
    // Validate required fields
    if (!Sid) {
        return res.status(400).json({ error: 'Sid (Site identifier) is required.' });
      }
      if (!traveauxData) {
        return res.status(400).json({ error: 'traveauxData is required.' });
      }
    try {
        const result = await traveauxModel.createTraveaux(Sid,traveauxData)
      if (!result.success) {
        console.error("Error in model operation:", result.error);
        return res.status(400).json({ error: result.error });
      }
    // Return a success response with the created data
    return res.status(201).json({
        message: 'Traveau successfully created and associated with Site.',
        data: result.data,
      });
    } catch (error) {
      console.error('Error Traveau :', error.message);
      return res.status(500).json({ error: 'An error occurred while creating the Traveau.' });
    }
  };
// Get all active Traveaux controller 
const getAllTravx = async(req,res)=>{
    const siteId = req.params.Sid;
    const result = await traveauxModel.getAllTraveaux(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get Traveaux by its id controller 
const getTravById = async(req,res) => {
  const travId = req.params.id;
    const result = await traveauxModel.getTraveauxById(travId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
//Update Traveaux controller 
const updateTrav = async (req, res) => {
  try {
    // Extract Devis ID from URL parameters
    const travId = req.params.id;
    let updates = { ...req.body }; // Extract update fields from request body
    console.log('--- Update Traveaux Request ---');
    console.log('Trav ID :', travId);
    console.log('Request Body:', updates);
    // Validate Devis ID
    if (!travId) {
      console.error('Error: trav id  not provided');
      return res.status(400).json({ error: 'Trav ID is required.' });
    }
    // Validate update fields
    if (!updates || Object.keys(updates).length === 0) {
      console.error('Error: No update fields provided');
      return res.status(400).json({ error: 'No update fields provided.' });
    }
    console.log('Mapping process started for update fields');
    console.log('Transformed update fields:', updates);

    // Call the model to update the dr
    const result = await traveauxModel.updateTraveaux(travId, updates);
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
// Desactivate Traveaux controller 
const desactivateTrav = async(req,res) =>{
    const travId = req.params.id ; 
    const result = await traveauxModel.desactivateTraveaux(travId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Activate Traveaux controller 
const activateTrav = async(req,res)=> {
    const travId = req.params.id ; 
    const result = await traveauxModel.activateTraveaux(travId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getActiveTravs = async(req,res) => {
    const siteId = req.params.Sid ; 
    const result = await traveauxModel.getActiveTraveaux(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getInactiveTravs = async(req,res) => {
    const siteId = req.params.Sid ; 
    const result = await traveauxModel.getInactiveTraveaux(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
// traveaux controller 
const traveauxController = {
   createTraveau,
    getAllTravx,
    getTravById,
    updateTrav,
    desactivateTrav,
    activateTrav,
    getActiveTravs,
    getInactiveTravs,
}
export default traveauxController ; 