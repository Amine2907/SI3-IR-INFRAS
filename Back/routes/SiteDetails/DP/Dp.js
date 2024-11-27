import express from "express";
const router = express.Router();
import DpController from "../../../controllers/SiteDetails/DP/DpController";

router.post('/create-dp-prospect',DpController.createDp);
router.get('/:Proid/dps',DpController.getAllDps);
router.get('/:Proid/active-dps',DpController.getActiveDps);
router.get('/:Proid/inactive-dps',DpController.getInactiveDps);
router.get('/:id',DpController.getDpsById);
router.put('/:id',DpController.updateDp);
router.patch('/:id/desactivate',DpController.desactivateDp);
router.patch('/:id/activate',DpController.activateDp);
export default router ; 