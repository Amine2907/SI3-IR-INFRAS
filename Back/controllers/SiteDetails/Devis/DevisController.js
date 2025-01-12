import devisModel from "../../../models/SiteDetails/Devis/DevisModel.js";
const fetchActiveFrs = async (req,res) => {
    try {
        const result = await devisModel.getActiveFournisseurs();
        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return res.status(500).json({ success: false, message: result.error });
        }
    } catch(error){
        return res.status(500).json({ success: false, message: error.message });
    }
};
const fetchActivePais = async (req,res) => {
    const siteId = req.params.Sid;
    try {
        const result = await devisModel.getActivePais(siteId);
        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return res.status(500).json({ success: false, message: result.error });
        }
    } catch(error){
        return res.status(500).json({ success: false, message: error.message });
    }
};
const fetchActiveFacture = async (req,res) => {
    const siteId = req.params.Sid;
    try {
        const result = await devisModel.getActiveFacture(siteId);
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
const createDevis = async (req, res) => {
    const { Sid, devisData } = req.body;
    // Validate required fields
    if (!Sid) {
        return res.status(400).json({ error: 'EB (Site identifier) is required.' });
      }
      if (!devisData) {
        return res.status(400).json({ error: 'devisData is required.' });
      }
    try {
        const result = await devisModel.createDevis(Sid,devisData)
      if (!result.success) {
        console.error("Error in model operation:", result.error);
        return res.status(400).json({ error: result.error });
      }
    // Return a success response with the created data
    return res.status(201).json({
        message: 'Devis successfully created and associated with site.',
        data: result.data,
      });
    } catch (error) {
      console.error('Error creating Devis:', error.message);
      return res.status(500).json({ error: 'An error occurred while creating the Devis.' });
    }
  };
// Get all active drs controller 
const getAllDevis = async(req,res)=>{
    const siteId = req.params.Sid;
    const result = await devisModel.getAllDevis(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get dr by its id controller 
const getDevisById = async(req,res) => {
  const devisId = req.params.id;
    const result = await devisModel.getDevisById(devisId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
//Update dr controller 
const updateDevis = async (req, res) => {
  try {
    // Extract Devis ID from URL parameters
    const devisId = req.params.id;
    let updates = { ...req.body }; // Extract update fields from request body
    console.log('--- Update dr Request ---');
    console.log('Devis ID :', devisId);
    console.log('Request Body:', updates);
    // Validate Devis ID
    if (!devisId) {
      console.error('Error: Devis ID not provided');
      return res.status(400).json({ error: 'Devis ID is required.' });
    }
    // Validate update fields
    if (!updates || Object.keys(updates).length === 0) {
      console.error('Error: No update fields provided');
      return res.status(400).json({ error: 'No update fields provided.' });
    }
    console.log('Mapping process started for update fields');
    console.log('Transformed update fields:', updates);

    // Call the model to update the dr
    const result = await devisModel.updateDevis(devisId, updates);
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
const desactivateDevis = async(req,res) =>{
    const devisId = req.params.id ; 
    const result = await devisModel.desactivateDevis(devisId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Activate dr controller 
const activateDevis = async(req,res)=> {
    const devisId = req.params.id ; 
    const result = await devisModel.activateDevis(devisId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getAllActiveDevis = async(req,res) => {
    const siteId = req.params.Sid ; 
    const result = await devisModel.getAllActiveDevis(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getAllInactiveDevis = async(req,res) => {
    const siteId = req.params.Sid ; 
    const result = await devisModel.getAllInactiveDevis(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
// Search drs controller 
const devisController = {
    fetchActiveFrs,
    fetchActiveFacture,
    createDevis,
    getAllDevis,
    getDevisById,
    updateDevis,
    desactivateDevis,
    activateDevis,
    getAllActiveDevis,
    getAllInactiveDevis,
    fetchActivePais,
}
export default devisController ; 