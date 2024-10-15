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
const updateContact = async(req,res) =>{
    const contactId = req.params.id;
    const updates = req.body ;
    const result = await contactsModel.updateContact(contactId,updates);
    if(!result.success){
        return res.status(400).json({error:result.error});
    }
    return res.status(200).json(result.data);
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