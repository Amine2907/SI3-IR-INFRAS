/**
 * @author: Mohamed Amine EL BAH 
 * @description: this file contains all the controller functions for the Companys feature.
 * @functions:
 * - createCompany: creates a Company in the database
 * - getAllCompanys: gets all the Companys in the database with is_active = true
 * - getCompanysById: gets a Company by its id
 * - updateCompany: updates a Company in the database
 * - desactivateCompany: deactivates a Company in the database
 * - activateCompany: activates a Company in the database
 * - searchCompanys: searches Companys in the database
 * - getActiveCompanys: gets all the active Companys in the database
 * - getInactiveCompanys: gets all the inactive Companys in the database
 */
import companiesModel from "../models/companyModel.js";

//Create Company controlller 
const createCompany = async(req,res) =>{
    const newCompany = {...req.body,is_active:true};
    const result = await companiesModel.createcompany(newCompany);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.result);
};
// Get all active Companys controller 
const getAllCompanys = async(req,res)=>{
    const result = await companiesModel.getAllcompanys();
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get Company by its id controller 
const getCompanysById = async(req,res) => {
    const CompanyId = req.params.id ; 
    const result = await companiesModel.GetcompanysById(CompanyId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
//Update Company controller 
const updateCompany = async (req, res) => {
    try {
      // Extract Company ID from URL parameters
      const CompanyId = req.params.id;
      // Extract update fields from request body
      const updates = req.body;
      console.log('--- Update Company Request ---');
      console.log('Company ID:', CompanyId); 
      console.log('Request Body:', updates);
      // Ensure the Company ID is provided
      if (!CompanyId) {
        console.error('Error: Company ID not provided');
        return res.status(400).json({ error: 'Company ID is required.' });
      }
      // Ensure updates contain necessary fields (optional validation)
      if (!updates || Object.keys(updates).length === 0) {
        console.error('Error: No update fields provided');
        return res.status(400).json({ error: 'No update fields provided.' });
      }
      // Call the model to update the Company
      const result = await companiesModel.updatecompany(CompanyId, updates);
      console.log('--- Model Response ---');
      console.log('Result:', result);
  
      // Handle the result from the model
      if (!result.success) {
        console.error('Error from Model:', result.error);
        return res.status(400).json({ error: result.error });
      }
      // Return the updated Company data
      console.log('Update Successful. Returning updated data:', result.data);
      return res.status(200).json(result.data);
    } catch (error) {
      // Catch unexpected errors
      console.error('Unexpected Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
// Desactivate Company controller 
const desactivateCompany = async(req,res) =>{
    const CompanyId = req.params.id ; 
    const result = await companiesModel.desactivatecompany(CompanyId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Activate Company controller 
const activateCompany = async(req,res)=> {
    const CompanyId = req.params.id ; 
    const result = await companiesModel.desactivatecompany(CompanyId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getActiveCompanys = async(req,res) => {
    const result = await companiesModel.getAllActivecompanys();
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getInactiveCompanys = async(req,res) => {
    const result = await companiesModel.getAllInactivecompanys();
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
const companyController = {
    createCompany,
    getAllCompanys,
    getCompanysById,
    updateCompany,
    desactivateCompany,
    activateCompany,
    getActiveCompanys,
    getInactiveCompanys,
}
export default companyController ; 