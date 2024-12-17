import express from "express";
const router = express.Router();
import miseEnServiceController from "../../../controllers/SiteDetails/MES/MesController.js";
router.post('/create-mes-site',miseEnServiceController.createMes);
router.put('/:id',miseEnServiceController.updateMES);
router.get('/:id',miseEnServiceController.getMesById);
router.get('/:Sid/mes',miseEnServiceController.getAllMes);
router.get('/:Sid/active-mes',miseEnServiceController.getActiveMes);
router.get('/:Sid/inactive-mes',miseEnServiceController.getInactiveMes);
router.patch('/:id/desactivate',miseEnServiceController.desactivateMes);
router.patch('/:id/activate',miseEnServiceController.activateMes);

export default router; 