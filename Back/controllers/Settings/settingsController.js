/**
 ** @author: Mohamed Amine EL BAH 
 * Ce fichier contient le contrôleur pour la fonctionnalité des paramètres.
 * Il fournit des fonctions pour interagir avec le modèle des paramètres.
 * Les fonctions incluent :
 * - getAccountInfo: récupère les informations de l'utilisateur actuel
 * - updatePassword: met à jour le mot de passe de l'utilisateur actuel
 * - listUsers: liste tous les utilisateurs de la base de données
 * - updateUserAccount: met à jour les informations du compte utilisateur
 * @module settingsController
 */
 import { supabase } from "../../config/supabaseClient.js";
 import settingsModel from "../../models/Settings/settingsModel.js";
 
 // 1. Récupérer les informations du compte
 const getAccountInfo = async (req, res) => {
     const userId = req.user.id;
     const result = await settingsModel.getAccountInfo(userId);
     
     if (!result.success) {
         return res.status(400).json({ error: result.error });
     }
     
     res.status(200).json(result.data);
 };
 
 // 2. Mettre à jour le mot de passe
 const updatePassword = async (req, res) => {
   const { currentPassword, newPassword } = req.body;
   const userId = req.user.id;
   try {
     // Vérifier le mot de passe actuel
     const { error: signInError } = await supabase.auth.signInWithPassword({
       email: req.user.email,
       password: currentPassword,
     });
     if (signInError) {
       return res.status(400).json({ error: "Le mot de passe actuel est incorrect." });
     }
     // Mettre à jour le mot de passe
     const { error: updateError } = await supabase.auth.updateUser({
       password: newPassword,
     });
     if (updateError) {
       throw updateError;
     }
     res.status(200).json({ message: "Mot de passe changé avec succès." });
   } catch (error) {
     console.error("Erreur lors du changement de mot de passe :", error);
     res.status(500).json({ error: "Une erreur est survenue lors du changement de mot de passe." });
   }
 };
 
 // Mettre à jour les informations du compte utilisateur
 const updateUserAccount = async (req, res) => {
     const userId = req.user?.id;
     if (!userId) {
         return res.status(400).json({ error: "L'ID utilisateur est manquant dans la requête." });
     }
     const userData = req.body;
     const result = await settingsModel.updateUser(userId, userData);
     if (!result.success) {
         return res.status(400).json({ error: result.error });
     }
     res.status(200).json({ message: "Compte utilisateur mis à jour avec succès." });
 };
 
 // 3. Lister tous les utilisateurs
 const listUsers = async (req, res) => {
     const result = await settingsModel.listUsers();
     
     if (!result.success) {
         return res.status(400).json({ error: result.error });
     }
     
     res.status(200).json(result.data);
 };
 
 // Exportation des méthodes du contrôleur
 const settingsController = {
     getAccountInfo,
     updatePassword,
     listUsers,
     updateUserAccount,
 };
 export default settingsController;
 