/**
 * @author: Mohamed Amine EL BAH 
 * @description: Ce fichier contient toutes les fonctions du contrôleur pour la fonctionnalité des entreprises.
 * @functions:
 * - createCompany: crée une entreprise dans la base de données
 * - getAllCompanys: récupère toutes les entreprises actives dans la base de données
 * - getCompanysById: récupère une entreprise par son identifiant
 * - updateCompany: met à jour une entreprise dans la base de données
 * - desactivateCompany: désactive une entreprise dans la base de données
 * - activateCompany: active une entreprise dans la base de données
 * - searchCompanys: recherche des entreprises dans la base de données
 * - getActiveCompanys: récupère toutes les entreprises actives dans la base de données
 * - getInactiveCompanys: récupère toutes les entreprises inactives dans la base de données
 */
import companiesModel from "../../models/Company/companyModel.js";

// Créer une entreprise
const createCompany = async(req,res) =>{
    const newCompany = {...req.body,is_active:true};
    const result = await companiesModel.createcompany(newCompany);
    if(!result.success){
        return res.status(400).json({error: result.error});
    }
    return res.status(200).json(result.result);
};

// Récupérer toutes les entreprises actives
const getAllCompanys = async(req,res)=>{
    const result = await companiesModel.getAllcompanys();
    if(!result.success){
        return res.status(400).json({error: result.error});
    }
    return res.status(200).json(result.data);
};

// Récupérer une entreprise par son identifiant
const getCompanysById = async(req,res) => {
    const CompanyId = req.params.id ; 
    const result = await companiesModel.GetcompanysById(CompanyId);
    if(!result.success){
        return res.status(400).json({error: result.error});
    }
    return res.status(200).json(result.data);
}

// Mettre à jour une entreprise
const updateCompany = async (req, res) => {
    try {
      const CompanyId = req.params.id;
      const updates = req.body;
      
      if (!CompanyId) {
        return res.status(400).json({ error: "L'identifiant de l'entreprise est requis." });
      }
      if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "Aucune donnée de mise à jour fournie." });
      }
      
      const result = await companiesModel.updatecompany(CompanyId, updates);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      return res.status(200).json(result.data);
    } catch (error) {
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

// Désactiver une entreprise
const desactivateCompany = async(req,res) =>{
    const CompanyId = req.params.id ; 
    const result = await companiesModel.desactivatecompany(CompanyId);
    if(!result.success){
        return res.status(400).json({error: result.error});
    }
    return res.status(200).json(result.data);
};

// Activer une entreprise
const activateCompany = async(req,res)=> {
    const CompanyId = req.params.id ; 
    const result = await companiesModel.activatecompany(CompanyId);
    if(!result.success){
        return res.status(400).json({error: result.error});
    }
    return res.status(200).json(result.data);
};

// Récupérer les entreprises actives
const getActiveCompanys = async(req,res) => {
    const result = await companiesModel.getAllActivecompanys();
    if(!result.success){
        return res.status(400).json({error: result.error});
    }
    return res.status(200).json(result.data);
};

// Récupérer les entreprises inactives
const getInactiveCompanys = async(req,res) => {
    const result = await companiesModel.getAllInactivecompanys();
    if(!result.success){
        return res.status(400).json({error: result.error});
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

export default companyController;
