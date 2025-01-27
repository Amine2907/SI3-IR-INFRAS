import express from "express";
const router = express.Router();
import dashChartsController from "../../controllers/Dashboard/dashChartsCntrol.js";
// Define routes for each dashboard metric
router.get('/dr-by-programme', dashChartsController.getDRCountByProgramme);
router.get('/devis-recu-by-programme', dashChartsController.getDevisRecuByProgramme);
router.get('/devis-en-attente-by-programme', dashChartsController.getDevisEnAttenteByProgramme);
router.get('/devis-signe-by-programme', dashChartsController.getDevisSigneByProgramme);
router.get('/devis-validation-operateur-by-programme', dashChartsController.getDevisValidationOperateurByProgramme);
router.get('/reglement-ok-by-programme', dashChartsController.getReglementOkByProgramme);
router.get('/reglement-en-attente-by-programme', dashChartsController.getReglementEnAttenteByProgramme);
router.get('/planification-extension-by-programme', dashChartsController.getPlanificationExtensionByProgramme);
router.get('/extension-ok-by-programme', dashChartsController.getExtensionOkByProgramme);
router.get('/planification-branchements-by-programme', dashChartsController.getPlanificationBranchementsByProgramme);
router.get('/branchement-ok-by-programme', dashChartsController.getBranchementOkByProgramme);
router.get('/consuel-recu-by-programme', dashChartsController.getConsuelRecuByProgramme);
router.get('/demande-mes-realisee-by-programme', dashChartsController.getDemandeMESRealiseeByProgramme);
router.get('/consuel-en-attente-by-programme', dashChartsController.getConsuelEnAttenteByProgramme);
router.get('/demande-mes-en-attente-by-programme', dashChartsController.getDemandeMESEnAttenteByProgramme);

export default router;
