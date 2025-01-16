import express from "express";
const router = express.Router();
import dashboardController from "../../controllers/Dashboard/dashContoller.js";

router.get('/dr', dashboardController.countDr);
router.get('/devis-recu', dashboardController.countDevisRecu);
router.get('/devis-en-attente', dashboardController.countDevisEnAttente);
router.get('/devis-signe', dashboardController.countDevisSigne);
router.get('/devis-validation-operateur', dashboardController.countDevisValidationOpérateur);
router.get('/reglement-ok', dashboardController.countReglementOk);
router.get('/reglement-en-attente', dashboardController.countReglementEnAttente);
router.get('/planification-extension', dashboardController.countPlanificationExtension);
router.get('/extension-ok', dashboardController.countExtensionOk);
router.get('/planification-branchements', dashboardController.countPlanificationBranchements);
router.get('/branchement-ok', dashboardController.countBranchementOk);
router.get('/consuel-recu', dashboardController.countConsuelRecu);
router.get('/demande-mes-realisee', dashboardController.countDemandeMESRealisee);
router.get('/consuel-en-attente', dashboardController.countConsuelEnAttente);
router.get('/demande-mes-en-attente', dashboardController.countDemandeMESEnAttente);

export default router;