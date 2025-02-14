// controllers/commentController.js
import commentModel from '../../models/Comments/genericModel.js';
import { supabase } from '../../config/supabaseClient.js';

// Ajouter un commentaire à une entité
const addComment = async (req, res) => {
  const { entityName, comment, Sid } = req.body;
  if (!entityName || !comment || !Sid) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }
  try {
    // Récupérer les données de l'utilisateur authentifié
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    // Gérer l'erreur si l'utilisateur n'est pas authentifié ou n'existe pas
    if (userError || !user) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }
    // Ajouter le commentaire dans la base de données (dans la colonne `commentaires` de l'entité)
    const result = await commentModel.addComment(entityName, comment, Sid);
    if (!result) {
      console.log("Échec de l'ajout du commentaire");
      return res.status(500).json({ error: "Échec de l'ajout du commentaire" });
    }
    res.status(200).json({ message: "Commentaire ajouté avec succès", result });
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Récupérer les commentaires d'une entité
const getComments = async (req, res) => {
  const { entityName, Sid } = req.query;
  if (!entityName || !Sid) {
    return res.status(400).json({ error: "Paramètres requis manquants" });
  }
  try {
    const comments = await commentModel.getComments(entityName, Sid);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

const commentController = {
  addComment,
  getComments,
};

export default commentController;
