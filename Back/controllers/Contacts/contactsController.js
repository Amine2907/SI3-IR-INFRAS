/**
 * @author: Mohamed Amine EL BAH 
 * @description: Ce fichier contient toutes les fonctions du contrôleur pour la fonctionnalité des contacts.
 * @functions:
 * - createContact: crée un contact dans la base de données
 * - getAllContacts: récupère tous les contacts actifs dans la base de données
 * - getContactsById: récupère un contact par son identifiant
 * - updateContact: met à jour un contact dans la base de données
 * - desactivateContact: désactive un contact dans la base de données
 * - activateContact: active un contact dans la base de données
 * - searchContacts: recherche des contacts dans la base de données
 * - getActiveContacts: récupère tous les contacts actifs dans la base de données
 * - getInactiveContacts: récupère tous les contacts inactifs dans la base de données
 */
import contactsModel from "../../models/Contacts/contactsModel.js";

// Créer un contact
const createContact = async(req,res) =>{
    const newContact = {...req.body,is_active:true};
    const result = await contactsModel.createContact(newContact);
    if(!result.success){
        return res.status(400).json({error: result.error});
    }
    return res.status(200).json(result.result);
};

// Récupérer tous les contacts actifs
const getAllContacts = async(req,res)=>{
    const result = await contactsModel.getAllContacts();
    if(!result.success){
        return res.status(400).json({error: result.error});
    }
    return res.status(200).json(result.data);
};

// Récupérer un contact par son identifiant
const getContactsById = async(req,res) => {
    const contactId = req.params.id ; 
    const result = await contactsModel.GetContactsById(contactId);
    if(!result.success){
        return res.status(400).json({error: result.error});
    }
    return res.status(200).json(result.data);
}

// Mettre à jour un contact
const updateContact = async (req, res) => {
    try {
      const contactId = req.params.id;
      const updates = req.body;
      
      if (!contactId) {
        return res.status(400).json({ error: "L'identifiant du contact est requis." });
      }
      if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "Aucune donnée de mise à jour fournie." });
      }
      
      const result = await contactsModel.updateContact(contactId, updates);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      return res.status(200).json(result.data);
    } catch (error) {
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

// Désactiver un contact
const desactivateContact = async(req,res) =>{
    const contactId = req.params.id ; 
    const result = await contactsModel.desactivateContact(contactId);
    if(!result.success){
        return res.status(400).json({error: result.error});
    }
    return res.status(200).json(result.data);
};

// Activer un contact
const activateContact = async(req,res)=> {
    const contactId = req.params.id ; 
    const result = await contactsModel.activateContact(contactId);
    if(!result.success){
        return res.status(400).json({error: result.error});
    }
    return res.status(200).json(result.data);
};

// Récupérer les contacts actifs
const getActiveContacts = async(req,res) => {
    const result = await contactsModel.getAllActiveContacts();
    if(!result.success){
        return res.status(400).json({error: result.error});
    }
    return res.status(200).json(result.data);
};

// Récupérer les contacts inactifs
const getInactiveContacts = async(req,res) => {
    const result = await contactsModel.getAllInactiveContacts();
    if(!result.success){
        return res.status(400).json({error: result.error});
    }
    return res.status(200).json(result.data);
}

// Rechercher des contacts
const searchContacts = async(req,res) => {
    const filters = req.query ;
    const result = await contactsModel.searchContacts(filters); 
    if(!result.success){
        return res.status(400).json({error: result.error});
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

export default contactController;
