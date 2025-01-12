/**
 * @author: Mohamed Amine EL BAH 
 * @description: this file contains all the controller functions for the contacts feature.
 * @functions:
 * - createContact: creates a contact in the database
 * - getAllContacts: gets all the contacts in the database with is_active = true
 * - getContactsById: gets a contact by its id
 * - updateContact: updates a contact in the database
 * - desactivateContact: deactivates a contact in the database
 * - activateContact: activates a contact in the database
 * - searchContacts: searches contacts in the database
 * - getActiveContacts: gets all the active contacts in the database
 * - getInactiveContacts: gets all the inactive contacts in the database
 */
import contactsModel from "../../models/Contacts/contactsModel.js";
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
const getActiveContacts = async(req,res) => {
    const result = await contactsModel.getAllActiveContacts();
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
};
const getInactiveContacts = async(req,res) => {
    const result = await contactsModel.getAllInactiveContacts();
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
}
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
    getActiveContacts,
    getInactiveContacts,
}
export default contactController ; 