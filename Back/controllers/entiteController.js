import entityModel from "../models/entiteModel.js";

// Create entity controller 
const createEntite = async(req,res) => {
    const newEntite = {...req.body , is_active:true};
    const result = await entityModel.createEntite(newEntite);
    if(!result.success){
        return res.status(400).json({error: result.error});
    }
    res.status(201).json(result.result);
};
// GetAllEntites controller 
const getAllEntites = async(req,res) => {
    const result = await entityModel.getAllEntites();
    if(!result.success){
        return res.status(400).json({error : result.error});
    }
    res.status(200).json(result.data);
};
const getActiveEntites = async(req,res) => {
    const result = await entityModel.getAllActiveEntites();
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getInactiveEntites = async(req,res) => {
    const result = await entityModel.getAllInactiveEntites();
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
// GetEntityById controller 
const getEntityById = async(req,res) => {
    const result = await entityModel.getEntityById(req.params.id);
    if(!result.success){
        return res.status(400).json({error : result.error});
    }
    res.status(200).json(result.data);
};
// UpdateEntity controller 
const updateEntity = async(req,res) => {
try {
    // Extract contact ID from URL parameters
    const entiteID = req.params.id;
    // Extract update fields from request body
    const updates = req.body;
    console.log('--- Update Entity Request ---');
    console.log('Contact ID:', entiteID); 
    console.log('Request Body:', updates);
    // Ensure the contact ID is provided
    if (!entiteID) {
        console.error('Error: Entite ID not provided');
        return res.status(400).json({ error: 'Entite ID is required.' });
      }
    // Ensure updates contain necessary fields (optional validation)
    if (!updates || Object.keys(updates).length === 0) {
        console.error('Error: No update fields provided');
        return res.status(400).json({ error: 'No update fields provided.' });
    }
    const result = await entityModel.updateEntity(entiteID , updates);
    console.log('--- Model Response ---');
    console.log('Result:', result);
    if(!result.success){
        console.error('Error from Model:', result.error);
        return res.status(400).json({error : result.error})
    }
    console.log('Update Successful. Returning updated data:', result.data);
    res.status(200).json(result.data);
}catch(error){
      // Catch unexpected errors
      console.error('Unexpected Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
}
};
// DesactivateEntity controller 
const desactivateEntity = async(req,res) => {
    const result = await entityModel.desactivateEntity(req.params.id);
    if(!result.success){
        return res.status(400).json({error : result.error})
    }
    res.status(200).json(result.data);
};
// ActivateEntiy controller 
const activateEntity = async(req,res) => {
    const result = await entityModel.activateEntity(req.params.id);
    if(!result.success){
        return res.status(400).json({error : result.error})
    }
    res.status(200).json(result.data);
};
// SearchENtity controller 
const searchEntites = async(req,res) => {
    const filters = req.body 
    const result = await entityModel.searchEntites(filters);
    if(!result.success){
        return res.status(400).json({error : result.error})
    }
    res.status(200).json(result.data);
};
// Call for entityController 
const entityController = {
    createEntite,
    getAllEntites,
    getEntityById,
    updateEntity,
    activateEntity,
    desactivateEntity,
    searchEntites,
    getActiveEntites,
    getInactiveEntites,
}
export default entityController ; 