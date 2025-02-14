import devisModel from "../../../models/SiteDetails/Devis/DevisModel.js";

// Récupérer les fournisseurs actifs
const fetchActiveFrs = async (req, res) => {
    try {
        const result = await devisModel.getActiveFournisseurs();
        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return res.status(500).json({ success: false, message: result.error });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Récupérer les PAIs actifs pour un site donné
const fetchActivePais = async (req, res) => {
    const siteId = req.params.Sid;
    try {
        const result = await devisModel.getActivePais(siteId);
        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return res.status(500).json({ success: false, message: result.error });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Récupérer les factures actives pour un site donné
const fetchActiveFacture = async (req, res) => {
    const siteId = req.params.Sid;
    try {
        const result = await devisModel.getActiveFacture(siteId);
        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return res.status(500).json({ success: false, message: result.error });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Créer un devis
const createDevis = async (req, res) => {
    const { Sid, devisData } = req.body;
    
    if (!Sid) {
        return res.status(400).json({ error: "L'identifiant du site (EB) est requis." });
    }
    if (!devisData) {
        return res.status(400).json({ error: "Les données du devis sont requises." });
    }
    
    try {
        const result = await devisModel.createDevis(Sid, devisData);
        
        if (!result.success) {
            console.error("Erreur dans l'opération du modèle :", result.error);
            return res.status(400).json({ error: result.error });
        }
        
        return res.status(201).json({
            message: "Devis créé avec succès et associé au site.",
            data: result.data,
        });
    } catch (error) {
        console.error("Erreur lors de la création du devis :", error.message);
        return res.status(500).json({ error: "Une erreur est survenue lors de la création du devis." });
    }
};

// Récupérer tous les devis d'un site donné
const getAllDevis = async (req, res) => {
    const siteId = req.params.Sid;
    const result = await devisModel.getAllDevis(siteId);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    return res.status(200).json(result.data);
};

// Récupérer un devis par son identifiant
const getDevisById = async (req, res) => {
    const devisId = req.params.id;
    const result = await devisModel.getDevisById(devisId);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    return res.status(200).json(result.data);
};

// Mettre à jour un devis
const updateDevis = async (req, res) => {
    try {
        const devisId = req.params.id;
        let updates = { ...req.body };
        
        if (!devisId) {
            return res.status(400).json({ error: "L'identifiant du devis est requis." });
        }
        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "Aucun champ de mise à jour fourni." });
        }
        
        const result = await devisModel.updateDevis(devisId, updates);
        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json(result.data);
    } catch (error) {
        return res.status(500).json({ error: "Erreur interne du serveur." });
    }
};

// Désactiver un devis
const desactivateDevis = async (req, res) => {
    const devisId = req.params.id;
    const result = await devisModel.desactivateDevis(devisId);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    return res.status(200).json(result.data);
};

// Activer un devis
const activateDevis = async (req, res) => {
    const devisId = req.params.id;
    const result = await devisModel.activateDevis(devisId);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    return res.status(200).json(result.data);
};

const devisController = {
    fetchActiveFrs,
    fetchActiveFacture,
    createDevis,
    getAllDevis,
    getDevisById,
    updateDevis,
    desactivateDevis,
    activateDevis,
    getAllActiveDevis: async (req, res) => {
        const siteId = req.params.Sid;
        const result = await devisModel.getAllActiveDevis(siteId);
        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json(result.data);
    },
    getAllInactiveDevis: async (req, res) => {
        const siteId = req.params.Sid;
        const result = await devisModel.getAllInactiveDevis(siteId);
        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json(result.data);
    },
    fetchActivePais,
    getfactureDetails: async (req, res) => {
        const devisId = req.params.id;
        const result = await devisModel.getfactureDetails(devisId);
        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json(result.data);
    },
};

export default devisController;
