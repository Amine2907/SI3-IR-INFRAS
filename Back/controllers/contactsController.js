// import { supabase } from "../Config/supabaseClient.js";
import contactsModel from "../models/contactsModel.js";

//Create contact controlller 
const createContact = async(req,res) =>{
    const newContact = {...req.body,is_active:true};
    const result = await contactsModel.createContact(newContact);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.result);
};
// Get all active contacts controller 
const getAllContacts = async(req,res)=>{
    const result = await contactsModel.getAllContacts();
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Get contact by its id controller 
const getContactsById = async(req,res) => {
    const contactId = req.params.id ; 
    const result = await contactsModel.GetContactsById(contactId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
//Update contact controller 
const updateContact = async (req, res) => {
    try {
      // Extract contact ID from URL parameters
      const contactId = req.params.id;
      // Extract update fields from request body
      const updates = req.body;
      console.log('--- Update Contact Request ---');
      console.log('Contact ID:', contactId); 
      console.log('Request Body:', updates);
      // Ensure the contact ID is provided
      if (!contactId) {
        console.error('Error: Contact ID not provided');
        return res.status(400).json({ error: 'Contact ID is required.' });
      }
      // Ensure updates contain necessary fields (optional validation)
      if (!updates || Object.keys(updates).length === 0) {
        console.error('Error: No update fields provided');
        return res.status(400).json({ error: 'No update fields provided.' });
      }
      // Call the model to update the contact
      const result = await contactsModel.updateContact(contactId, updates);
      console.log('--- Model Response ---');
      console.log('Result:', result);
  
      // Handle the result from the model
      if (!result.success) {
        console.error('Error from Model:', result.error);
        return res.status(400).json({ error: result.error });
      }
      // Return the updated contact data
      console.log('Update Successful. Returning updated data:', result.data);
      return res.status(200).json(result.data);
    } catch (error) {
      // Catch unexpected errors
      console.error('Unexpected Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
// Desactivate contact controller 
const desactivateContact = async(req,res) =>{
    const contactId = req.params.id ; 
    const result = await contactsModel.desactivateContact(contactId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Activate contact controller 
const activateContact = async(req,res)=> {
    const contactId = req.params.id ; 
    const result = await contactsModel.desactivateContact(contactId);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
// Search contacts controller 
const searchContacts = async(req,res) => {
    const filters = req.query ;
    const result = await contactsModel.searchContacts(filters); 
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const contactController = {
    createContact,
    getAllContacts,
    getContactsById,
    updateContact,
    desactivateContact,
    activateContact,
    searchContacts,
}
export default contactController ; 