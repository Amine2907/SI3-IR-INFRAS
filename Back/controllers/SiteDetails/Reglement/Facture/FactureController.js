import factureModel from "../../../../models/SiteDetails/Reglement/Facture/FactureModel.js";

//Create Facture controlller 
const createFacture = async (req, res) => {
    const { Sid, factureData } = req.body;
    // Validate required fields
    if (!Sid) {
        return res.status(400).json({ error: 'Sid (Site identifier) is required.' });
      }
      if (!factureData) {
        return res.status(400).json({ error: 'factureData is required.' });
      }
    try {
        const result = await factureModel.createFacture(Sid,factureData)
      if (!result.success) {
        console.error("Error in model operation:", result.error);
        return res.status(400).json({ error: result.error });
      }
    // Return a success response with the created data
    return res.status(201).json({
        message: 'Facture successfully created and associated with Devis.',
        data: result.data,
      });
    } catch (error) {
      console.error('Error creating Facture:', error.message);
      return res.status(500).json({ error: 'An error occurred while creating the Facture.' });
    }
  };
// Get all active factures controller 
const getAllFacture = async(req,res)=>{
    const siteId = req.params.Sid;
    const result = await factureModel.getAllFacture(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get dr by its id controller 
const getFactureById = async(req,res) => {
  const factureId = req.params.id;
    const result = await factureModel.getFactureById(factureId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
//Update dr controller 
const updateFacture = async (req, res) => {
  try {
    // Extract Devis ID from URL parameters
    const factureId = req.params.id;
    let updates = { ...req.body }; // Extract update fields from request body
    console.log('--- Update dr Request ---');
    console.log('Devis ID :', factureId);
    console.log('Request Body:', updates);
    // Validate Devis ID
    if (!factureId) {
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
    const result = await factureModel.updateFacture(factureId, updates);
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
const desactivateFacture = async(req,res) =>{
    const factureId = req.params.id ; 
    const result = await factureModel.desactivateFacture(factureId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Activate dr controller 
const activateFacture = async(req,res)=> {
    const factureId = req.params.id ; 
    const result = await factureModel.activateFacture(factureId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getAllActiveFacture = async(req,res) => {
    const siteId = req.params.Sid ; 
    const result = await factureModel.getActiveFacture(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getAllInactiveFacture = async(req,res) => {
    const siteId = req.params.Sid ; 
    const result = await factureModel.getInactiveFacture(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
// factures controller 
const factureController = {
    createFacture,
    getAllFacture,
    getFactureById,
    updateFacture,
    desactivateFacture,
    activateFacture,
    getAllActiveFacture,
    getAllInactiveFacture,
}
export default factureController ; 