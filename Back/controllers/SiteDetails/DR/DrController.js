/**
 * @author: Mohamed Amine EL BAH 
 * @description: this file contains all the controller functions for the drs feature.
 * @functions:
 * - createDr: creates a dr in the database
 * - getAlldrs: gets all the drs in the database with is_active = true
 * - getdrsById: gets a dr by its id
 * - updatedr: updates a dr in the database
 * - desactivatedr: deactivates a dr in the database
 * - activatedr: activates a dr in the database
 * - Searchdrs: searches drs in the database
 * - getActivedrs: gets all the active drs in the database
 * - getInactivedrs: gets all the inactive drs in the database
 */
import drModel from "../../../models/drDetails/DR/DrModel.js";
import { statusPropmapping } from "../../../models/drDetails/DR/DrData.js";
const fetchActiveEntites = async (req, res) => {
    try {
        const result = await drModel.getActiveEntites();
        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return res.status(500).json({ success: false, message: result.error });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
const fetchActiveProspects = async (req,res) => {
    try {
        const result = await drModel.getActiveProspects();
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
const createDr = async (req, res) => {
    try {
      // Extract and map the fields if they contain descriptions instead of IDs
      let data = { ...req.body };
      console.log("Mapping process started");
      // Map `SPRid_FK` if it's an object with `SPR_desc`
      if (data.SPRid_FK && typeof data.SPRid_FK === 'object' && data.SPRid_FK.SPR_desc) {
        const statusPropId = statusPropmapping[data.SPRid_FK.SPR_desc];
        console.log("Mapped status prop :", data.SPRid_FK.SPR_desc, "->", statusPropId);
        if (!statusPropId) {
          throw new Error(`Invalid status prop  description: ${data.SPRid_FK.SPR_desc}`);
        }
        data.SPRid_FK = data.SPRid_FK.SPR_desc; // Map back to description
      }
      console.log("Transformed data ready for insertion:", data);
      // Proceed to create the dr with transformed data
      const newdr = { ...data, is_active: true };
      const result = await drModel.createDr(newdr);
      if (!result.success) {
        console.error("Error in model operation:", result.error);
        return res.status(400).json({ error: result.error });
      }
      console.log("DR created successfully:", result.result);
      return res.status(200).json(result.result);
    } catch (error) {
      console.error("Error during DR creation:", error.message);
      return res.status(400).json({ error: error.message });
    }
  };
// Get all active drs controller 
const getAlldrs = async(req,res)=>{
    const result = await drModel.getAllDrs();
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get dr by its id controller 
const getdrsById = async(req,res) => {
  const drId = req.params.EB.replace(':', '');
    const result = await drModel.GetdrsById(drId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
//Update dr controller 
const updatedr = async (req, res) => {
  try {
    // Extract dr ID from URL parameters
    const drId = req.params.EB.replace(':EB=', '');
    let updates = { ...req.body }; // Extract update fields from request body
    console.log('--- Update dr Request ---');
    console.log('dr ID:', drId);
    console.log('Request Body:', updates);

    // Validate dr ID
    if (!drId) {
      console.error('Error: dr ID not provided');
      return res.status(400).json({ error: 'dr ID is required.' });
    }

    // Validate update fields
    if (!updates || Object.keys(updates).length === 0) {
      console.error('Error: No update fields provided');
      return res.status(400).json({ error: 'No update fields provided.' });
    }

    console.log('Mapping process started for update fields');

    // Handle mapping for `SPRid_FK`
    if (updates.SPRid_FK) {
      if (typeof updates.SPRid_FK === 'object' && updates.SPRid_FK.SPR_desc) {
        const statusPropId = statusPropmapping[updates.SPRid_FK.SPR_desc];
        if (!statusPropId) {
          throw new Error(`Invalid status prop  description: ${updates.SPRid_FK.SPR_desc}`);
        }
        updates.SPRid_FK = statusPropId; // Map to ID
      } else if (typeof updates.SPRid_FK === 'string' || typeof updates.SPRid_FK === 'number') {
        console.log('status prop  already mapped:', updates.SPRid_FK);
      } else {
        console.error('Invalid status prop _fk structure:', updates.SPRid_FK);
        throw new Error('Invalid status prop _fk structure');
      }
    }

    // Handle mapping for `programme_fk`
    if (updates.programme_fk) {
      if (typeof updates.programme_fk === 'object' && updates.programme_fk.PR_desc) {
        const programId = programMapping[updates.programme_fk.PR_desc];
        if (!programId) {
          throw new Error(`Invalid program description: ${updates.programme_fk.PR_desc}`);
        }
        updates.programme_fk = programId; // Map to ID
      } else if (typeof updates.programme_fk === 'string' || typeof updates.programme_fk === 'number') {
        console.log('Program already mapped:', updates.programme_fk);
      } else {
        console.error('Invalid programme_fk structure:', updates.programme_fk);
        throw new Error('Invalid programme_fk structure');
      }
    }

    // Handle mapping for `status_dr_fk`
    if (updates.status_dr_fk) {
      if (typeof updates.status_dr_fk === 'object' && updates.status_dr_fk.SS_desc) {
        const statusId = drStatusMapping[updates.status_dr_fk.SS_desc];
        if (!statusId) {
          throw new Error(`Invalid status description: ${updates.status_dr_fk.SS_desc}`);
        }
        updates.status_dr_fk = statusId; // Map to ID
      } else if (typeof updates.status_dr_fk === 'string' || typeof updates.status_dr_fk === 'number') {
        console.log('Status already mapped:', updates.status_dr_fk);
      } else {
        console.error('Invalid status_dr_fk structure:', updates.status_dr_fk);
        throw new Error('Invalid status_dr_fk structure');
      }
    }

    console.log('Transformed update fields:', updates);

    // Call the model to update the dr
    const result = await drModel.updatedr(drId, updates);
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
const desactivatedr = async(req,res) =>{
    const drId = req.params.id ; 
    const result = await drModel.desactivatedr(drId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Activate dr controller 
const activatedr = async(req,res)=> {
    const drId = req.params.id ; 
    const result = await drModel.activatedr(drId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getActivedrs = async(req,res) => {
    const result = await drModel.getAllActivedrs();
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getInactivedrs = async(req,res) => {
    const result = await drModel.getAllInactivedrs();
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
// Search drs controller 
const Searchdrs = async(req,res) => {
    const filters = req.query ;
    const result = await drModel.Searchdr(filters); 
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const demRacController = {
    fetchActiveEntites,
    fetchActiveProspects,
    createDr,
    getAlldrs,
    getdrsById,
    updatedr,
    desactivatedr,
    activatedr,
    Searchdrs,
    getActivedrs,
    getInactivedrs,
}
export default demRacController ; 