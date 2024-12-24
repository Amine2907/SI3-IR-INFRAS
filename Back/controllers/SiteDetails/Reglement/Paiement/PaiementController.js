import paiementModel from "../../../../models/SiteDetails/Reglement/Paiement/PaiementModel.js";
//Create Facture controlller 
const createPaiement = async (req, res) => {
  const { Sid,devis_fk, paiementData } = req.body;
  // Validate required fields
  if (!devis_fk) {
    return res.status(400).json({ error: 'devis_fk (Devis identifier) is required.' });
  }
  if (!Sid) {
    return res.status(400).json({ error: 'Sid (Site identifier) is required.' });
  }
  if (!paiementData) {
    return res.status(400).json({ error: 'paiementData is required.' });
  }
  try {
    // Call the model to create Paiement and handle associations
    const result = await paiementModel.createPaiement( Sid, devis_fk,paiementData);
    if (!result.success) {
      console.error('Error in model operation:', result.error);
      return res.status(400).json({ error: result.error });
    }
    // Return a success response with the created data
    return res.status(201).json({
      message: 'Paiement successfully created and associated with Devis and Site.',
      data: result.data,
    });
  } catch (error) {
    console.error('Error during Paiement creation:', error.message);
    return res.status(500).json({ error: 'An error occurred while creating the Paiement.' });
  }
};
// Get all active factures controller
const getAllPaie = async(req,res)=>{
    const siteId = req.params.Sid;
    const result = await paiementModel.getAllPais(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get dr by its id controller 
const getPaieById = async(req,res) => {
  const paieId = req.params.id;
    const result = await paiementModel.getPaieById(paieId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
//Update dr controller 
const updatePaie = async (req, res) => {
  try {
    // Extract Devis ID from URL parameters
    const paieId = req.params.id;
    let updates = { ...req.body }; // Extract update fields from request body
    console.log('--- Update fatcure Request ---');
    console.log('Devis ID :', paieId);
    console.log('Request Body:', updates);
    // Validate Devis ID
    if (!paieId) {
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
    const result = await paiementModel.updatePaie(paieId, updates);
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
const desactivatePaie = async(req,res) =>{
    const paieId = req.params.id ; 
    const result = await paiementModel.desactivatePaie(paieId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Activate dr controller 
const activatePaie = async(req,res)=> {
    const paieId = req.params.id ; 
    const result = await paiementModel.activatePaie(paieId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getAllActivePaie = async(req,res) => {
    const siteId = req.params.Sid ; 
    const result = await paiementModel.getActiveFacture(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getAllInactivePaie = async(req,res) => {
    const siteId = req.params.Sid ; 
    const result = await paiementModel.getInactiveFacture(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
// paiements controller 
const paiementController = {
   createPaiement,
    getAllPaie,
    getPaieById,
    updatePaie,
    desactivatePaie,
    activatePaie,
    getAllActivePaie,
    getAllInactivePaie,
}
export default paiementController ; 