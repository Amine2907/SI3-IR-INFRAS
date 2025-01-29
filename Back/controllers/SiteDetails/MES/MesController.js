import mesModel from "../../../models/SiteDetails/MES/MesModel.js";
//Create MES controlller 
const createMes = async (req, res) => {
    const { Sid, mesData } = req.body;
    // Validate required fields
    if (!Sid) {
        return res.status(400).json({ error: 'Sid (Site identifier) is required.' });
      }
      if (!mesData) {
        return res.status(400).json({ error: 'mesData is required.' });
      }
    try {
        const result = await mesModel.createMes(Sid,mesData)
      if (!result.success) {
        console.error("Error in model operation:", result.error);
        return res.status(400).json({ error: result.error });
      }
    // Return a success response with the created data
    return res.status(201).json({
        message: 'Mise en service successfully created and associated with Site.',
        data: result.data,
      });
    } catch (error) {
      console.error('Error Mise en service :', error.message);
      return res.status(500).json({ error: 'An error occurred while creating the MES.' });
    }
  };
// Get all active MES controller 
const getAllMes = async(req,res)=>{
    const siteId = req.params.Sid;
    const result = await mesModel.getAllMes(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get MES by its id controller 
const getMesById = async(req,res) => {
  const mesId = req.params.id;
    const result = await mesModel.getMesById(mesId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
//Update MES controller 
const updateMES = async (req, res) => {
  try {
    // Extract Devis ID from URL parameters
    const mesId = req.params.id;
    let updates = { ...req.body };
    console.log('--- Update MESeaux Request ---');
    console.log('MES ID :', mesId);
    console.log('Request Body:', updates);
    // Validate Devis ID
    if (!mesId) {
      console.error('Error: MES id  not provided');
      return res.status(400).json({ error: 'MES ID is required.' });
    }
    // Validate update fields
    if (!updates || Object.keys(updates).length === 0) {
      console.error('Error: No update fields provided');
      return res.status(400).json({ error: 'No update fields provided.' });
    }
    console.log('Mapping process started for update fields');
    console.log('Transformed update fields:', updates);

    // Call the model to update the dr
    const result = await mesModel.updateMes(mesId, updates);
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
// Desactivate MES controller 
const desactivateMes = async(req,res) =>{
    const mesId = req.params.id ; 
    const result = await mesModel.desactivateMes(mesId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Activate MESeaux controller 
const activateMes = async(req,res)=> {
    const mesId = req.params.id ; 
    const result = await mesModel.activateMes(mesId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getActiveMes = async(req,res) => {
    const siteId = req.params.Sid ; 
    const result = await mesModel.getActiveMes(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getInactiveMes = async(req,res) => {
    const siteId = req.params.Sid ; 
    const result = await mesModel.getInactiveMes(siteId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
// MESeaux controller 
const miseEnServiceController = {
   createMes,
    getAllMes,
    getMesById,
    updateMES,
    desactivateMes,
    activateMes,
    getActiveMes,
    getInactiveMes,
}
export default miseEnServiceController ; 