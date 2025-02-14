import siteContactModel from "../../models/Site/siteContactModel.js";

// Ajouter un contact existant à un site
const addExisitngSiteContact = async (req, res) => {
  const { Sid, Cids } = req.body;
  if (!Sid || !Cids || !Array.isArray(Cids)) {
    return res.status(400).json({ error: "Sid et un tableau de Cids sont requis" });
  }
  try {
    const data = await Promise.all(
      Cids.map((Cid) => siteContactModel.addExisitngSiteContact(Sid, Cid))
    );
    console.log("Données insérées :", data);
    return res.status(201).json({
      message: "Contacts associés au site avec succès",
      data: data,
    });
  } catch (error) {
    console.error("Erreur lors de l'association des contacts au site :", error);
    return res.status(500).json({ error: "Une erreur est survenue lors de l'association des contacts au site" });
  }
};

// Ajouter un nouveau contact à un site
const addNewContactSite = async (req, res) => {
  const { Sid, contactData } = req.body;
  if (!Sid) {
    return res.status(400).json({ error: "Sid est requis" });
  }
  if (!contactData) {
    return res.status(400).json({ error: "contactData est requis" });
  }
  try {
    const result = await siteContactModel.addNewContactSite(Sid, contactData);
    return res.status(201).json({
      message: "Contact créé et associé au site avec succès",
      data: result,
    });
  } catch (error) {
    console.error("Erreur lors de la création et de l'association du contact au site :", error);
    return res.status(500).json({ error: "Une erreur est survenue lors de l'association du contact au site" });
  }
};

// Supprimer un contact d'un site
const deleteContactSite = async (req, res) => {
  const { Sid, Cid } = req.body;
  if (!Sid || !Cid) {
    return res.status(400).json({ error: "Sid et Cid sont requis" });
  }
  try {
    const result = await siteContactModel.deleteSiteContact(Sid, Cid);
    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Aucune association trouvée à supprimer" });
    }
    return res.status(200).json({
      message: "Contact supprimé du site avec succès",
      data: result,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du contact du site :", error.message);
    return res.status(500).json({ error: "Une erreur est survenue lors de la suppression du contact du site" });
  }
};

// Récupérer les contacts d'un site
const getSiteContacts = async (req, res) => {
  const Sid = req.params.Sid;
  try {
    const contacts = await siteContactModel.getSiteConatcts(Sid);
    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ message: "Aucun contact trouvé pour ce site" });
    }
    return res.status(200).json({ contacts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Échec de la récupération des contacts du site" });
  }
};

// Afficher les contacts d'un site
const displayContactsSite = async (req, res) => {
  const Sid = req.params.Sid.replace(":", "");
  try {
    const result = await siteContactModel.displayContactsSite(Sid);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    return res.status(200).json(result.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Échec de la récupération des contacts du site" });
  }
};

const siteContactCntrl = {
  addExisitngSiteContact,
  deleteContactSite,
  getSiteContacts,
  displayContactsSite,
  addNewContactSite,
};
export default siteContactCntrl;
