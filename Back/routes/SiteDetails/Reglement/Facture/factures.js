import express from "express";
const router = express.Router();
import factureController from "../../../../controllers/SiteDetails/Reglement/Facture/FactureController.js";
router.post('/create-facture-site',factureController.createFacture);
router.put('/:id',factureController.updateFacture);
router.get('/:id',factureController.getFactureById);
router.get('/:Sid/facture',factureController.getAllFacture);
router.get('/:Sid/active-facture',factureController.getAllActiveFacture);
router.get('/:Sid/inactive-facture',factureController.getAllInactiveFacture);
router.patch('/:id/desactivate',factureController.desactivateFacture);
router.patch('/:id/activate',factureController.activateFacture);

export default router; 