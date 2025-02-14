import siteDynFieldsModel from "../../models/Site/siteDynamicFields.js";

// Récupérer le Prospect Retenu
const getPropsectRetenu = async (req, res) => {
    try {
      const Sid = req.params.Sid;
      const data = await siteDynFieldsModel.getPropsectretenu(Sid);
      if (!data || data.length === 0) {
        return res.status(404).json({ error: "Aucune donnée trouvée pour le Sid fourni" });
      }
      return res.status(200).json(data);
    } catch (error) {
      console.error("Erreur lors de la récupération du Prospect Retenu :", error.message);
      return res.status(500).json({ error: "Une erreur est survenue lors de la récupération du Prospect Retenu" });
    }
};

// Récupérer la date du DR
const getDrDate  = async (req, res) => {
    try {
      const Sid = req.params.Sid;
      const result = await siteDynFieldsModel.getDrDate(Sid);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      return res.status(200).json(result.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de la date du DR", error.message);
      return res.status(500).json({ error: "Une erreur est survenue lors de la récupération de la date du DR" });
    }
};

// Récupérer la date du Devis
const getDevisDate  = async (req, res) => {
    try {
      const Sid = req.params.Sid;
      const result = await siteDynFieldsModel.getDevisRecDate(Sid);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      return res.status(200).json(result.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de la date du Devis", error.message);
      return res.status(500).json({ error: "Une erreur est survenue lors de la récupération de la date du Devis" });
    }
};

// Récupérer la date du Règlement
const getReglementDate  = async (req, res) => {
    try {
      const Sid = req.params.Sid;
      const result = await siteDynFieldsModel.getReglementDate(Sid);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      return res.status(200).json(result.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de la date du Règlement", error.message);
      return res.status(500).json({ error: "Une erreur est survenue lors de la récupération de la date du Règlement" });
    }
};

// Récupérer la date MES (Mise en Service) réelle
const getMesDate = async (req, res) => {
    try {
        const Sid = req.params.Sid;
        const result = await siteDynFieldsModel.getMesReel(Sid);

        if (!result.success) {
            return res.status(200).json({ message: result.error });
        }

        return res.status(200).json({ MES_reel: result.data });
    } catch (error) {
        console.error("Erreur lors de la récupération de la date MES réelle :", error.message);
        return res.status(500).json({ error: "Une erreur inattendue est survenue lors de la récupération de la date MES réelle." });
    }
};

const siteFieldsController = {
    getPropsectRetenu,
    getDrDate,
    getDevisDate,
    getReglementDate,
    getMesDate,
};
export default siteFieldsController;
