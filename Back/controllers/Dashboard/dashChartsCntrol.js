import dashChartsModel from "../../models/Dashboard/dashCharts.js";

// DR Count by Programme
const getDRCountByProgramme = async (req, res) => {
  const result = await dashChartsModel.getDRCountByProgramme();
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result.data);
};

// Devis Reçu by Programme
const getDevisRecuByProgramme = async (req, res) => {
  const result = await dashChartsModel.getDevisRecuByProgramme();
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result.data);
};

// Devis En Attente by Programme
const getDevisEnAttenteByProgramme = async (req, res) => {
  const result = await dashChartsModel.getDevisEnAttenteByProgramme();
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result.data);
};

// Devis Signé by Programme
const getDevisSigneByProgramme = async (req, res) => {
  const result = await dashChartsModel.getDevisSigneByProgramme();
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result.data);
};

// Devis Validation Opérateur by Programme
const getDevisValidationOperateurByProgramme = async (req, res) => {
  const result = await dashChartsModel.getDevisValidationOperateurByProgramme();
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result.data);
};

// Règlement OK by Programme
const getReglementOkByProgramme = async (req, res) => {
  const result = await dashChartsModel.getReglementOkByProgramme();
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result.data);
};

// Règlement En Attente by Programme
const getReglementEnAttenteByProgramme = async (req, res) => {
  const result = await dashChartsModel.getReglementEnAttenteByProgramme();
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result.data);
};

// Planification Extension by Programme
const getPlanificationExtensionByProgramme = async (req, res) => {
  const result = await dashChartsModel.getPlanificationExtensionByProgramme();
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result.data);
};

// Extension OK by Programme
const getExtensionOkByProgramme = async (req, res) => {
  const result = await dashChartsModel.getExtensionOkByProgramme();
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result.data);
};

// Planification Branchements by Programme
const getPlanificationBranchementsByProgramme = async (req, res) => {
  const result = await dashChartsModel.getPlanificationBranchementsByProgramme();
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result.data);
};

// Branchement OK by Programme
const getBranchementOkByProgramme = async (req, res) => {
  const result = await dashChartsModel.getBranchementOkByProgramme();
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result.data);
};

// Consuel Reçu by Programme
const getConsuelRecuByProgramme = async (req, res) => {
  const result = await dashChartsModel.getConsuelRecuByProgramme();
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result.data);
};

// Demande de MES Réalisée by Programme
const getDemandeMESRealiseeByProgramme = async (req, res) => {
  const result = await dashChartsModel.getDemandeMESRealiseeByProgramme();
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result.data);
};

// Consuel En Attente by Programme
const getConsuelEnAttenteByProgramme = async (req, res) => {
  const result = await dashChartsModel.getConsuelEnAttenteByProgramme();
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result.data);
};

// Demande de MES En Attente by Programme
const getDemandeMESEnAttenteByProgramme = async (req, res) => {
  const result = await dashChartsModel.getDemandeMESEnAttenteByProgramme();
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result.data);
};

// Export all controller functions
const dashChartsController = {
  getDRCountByProgramme,
  getDevisRecuByProgramme,
  getDevisEnAttenteByProgramme,
  getDevisSigneByProgramme,
  getDevisValidationOperateurByProgramme,
  getReglementOkByProgramme,
  getReglementEnAttenteByProgramme,
  getPlanificationExtensionByProgramme,
  getExtensionOkByProgramme,
  getPlanificationBranchementsByProgramme,
  getBranchementOkByProgramme,
  getConsuelRecuByProgramme,
  getDemandeMESRealiseeByProgramme,
  getConsuelEnAttenteByProgramme,
  getDemandeMESEnAttenteByProgramme,
};

export default dashChartsController;
