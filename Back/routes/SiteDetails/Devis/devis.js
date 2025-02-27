import express from "express";
const router = express.Router();
import devisController from "../../../controllers/SiteDetails/Devis/DevisController.js";
router.post('/create-devis-site',devisController.createDevis);
router.put('/:id',devisController.updateDevis);
router.get('/:id',devisController.getDevisById);
router.get('/:Sid/devis',devisController.getAllDevis);
router.get('/:Sid/active-devis',devisController.getAllActiveDevis);
router.get('/:Sid/inactive-devis',devisController.getAllInactiveDevis);
router.get('/:Sid/active-factures',devisController.fetchActiveFacture);
router.get('/:Sid/active-fours',devisController.fetchActiveFrs);
router.get('/:Sid/active-paies',devisController.fetchActivePais);
router.patch('/:id/desactivate',devisController.desactivateDevis);
router.patch('/:id/activate',devisController.activateDevis);
router.get('/:id/facture-details',devisController.getfactureDetails);

export default router; 