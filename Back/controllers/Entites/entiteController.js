/**
 ** @author: Mohamed Amine EL BAH 
 * Ce fichier contient le contrôleur pour la fonctionnalité des entités.
 * Il fournit des fonctions pour interagir avec le modèle des entités.
 * Les fonctions incluent :
 * - createEntite: crée une nouvelle entité dans la base de données
 * - getAllEntites: récupère toutes les entités de la base de données
 * - getEntityById: récupère une entité par son ID
 * - updateEntity: met à jour une entité dans la base de données
 * - desactivateEntity: désactive une entité dans la base de données
 * - activateEntity: active une entité dans la base de données
 * - searchEntites: recherche des entités dans la base de données
 * - getActiveEntites: récupère toutes les entités actives de la base de données
 * - getInactiveEntites: récupère toutes les entités inactives de la base de données
 */
 import entityModel from "../../models/Entites/entiteModel.js";

 // Contrôleur pour créer une entité
 const createEntite = async(req,res) => {
     const newEntite = {...req.body , is_active:true};
     const result = await entityModel.createEntite(newEntite);
     if(!result.success){
         return res.status(400).json({error: result.error});
     }
     res.status(201).json(result.result);
 };
 
 // Récupérer toutes les entités
 const getAllEntites = async(req,res) => {
     const result = await entityModel.getAllEntites();
     if(!result.success){
         return res.status(400).json({error : result.error});
     }
     res.status(200).json(result.data);
 };
 
 // Récupérer toutes les entités actives
 const getActiveEntites = async(req,res) => {
     const result = await entityModel.getAllActiveEntites();
     if(!result.success){
         return res.status(400).json({error:result.error});
     }
     return res.status(200).json(result.data);
 };
 
 // Récupérer toutes les entités inactives
 const getInactiveEntites = async(req,res) => {
     const result = await entityModel.getAllInactiveEntites();
     if(!result.success){
         return res.status(400).json({error:result.error});
     }
     return res.status(200).json(result.data);
 }
 
 // Récupérer une entité par son ID
 const getEntityById = async(req,res) => {
     const result = await entityModel.getEntityById(req.params.id);
     if(!result.success){
         return res.status(400).json({error : result.error});
     }
     res.status(200).json(result.data);
 };
 
 // Mettre à jour une entité
 const updateEntity = async(req,res) => {
 try {
     const entiteID = req.params.id;
     const updates = req.body;
     
     if (!entiteID) {
         return res.status(400).json({ error: "L'ID de l'entité est requis." });
       }
     
     if (!updates || Object.keys(updates).length === 0) {
         return res.status(400).json({ error: "Aucun champ de mise à jour fourni." });
     }
     
     const result = await entityModel.updateEntity(entiteID , updates);
     
     if(!result.success){
         return res.status(400).json({error : result.error})
     }
     res.status(200).json(result.data);
 }catch(error){
       return res.status(500).json({ error: "Erreur interne du serveur" });
 }
 };
 
 // Désactiver une entité
 const desactivateEntity = async(req,res) => {
     const result = await entityModel.desactivateEntity(req.params.id);
     if(!result.success){
         return res.status(400).json({error : result.error})
     }
     res.status(200).json(result.data);
 };
 
 // Activer une entité
 const activateEntity = async(req,res) => {
     const result = await entityModel.activateEntity(req.params.id);
     if(!result.success){
         return res.status(400).json({error : result.error})
     }
     res.status(200).json(result.data);
 };
 
 // Rechercher des entités
 const searchEntites = async(req,res) => {
     const filters = req.query ; 
     const result = await entityModel.searchEntites(filters);
     if(!result.success){
         return res.status(400).json({error : result.error})
     }
     res.status(200).json(result.data);
 };
 
 // Contrôleur des entités
 const entityController = {
     createEntite,
     getAllEntites,
     getEntityById,
     updateEntity,
     activateEntity,
     desactivateEntity,
     searchEntites,
     getActiveEntites,
     getInactiveEntites,
 }
 export default entityController;
 