import express from "express";
const router = express.Router();
import paiementController from "../../../../controllers/SiteDetails/Reglement/Paiement/PaiementController.js";
router.post('/create-paie-site',paiementController.createPaiement);
router.put('/:id',paiementController.updatePaie);
router.get('/:id',paiementController.getPaieById);
router.get('/:Sid/paie',paiementController.getAllPaie);
router.get('/:Sid/active-paie',paiementController.getAllActivePaie);
router.get('/:Sid/inactive-paie',paiementController.getAllInactivePaie);
router.patch('/:id/desactivate',paiementController.desactivatePaie);
router.patch('/:id/activate',paiementController.activatePaie);

export default router; 