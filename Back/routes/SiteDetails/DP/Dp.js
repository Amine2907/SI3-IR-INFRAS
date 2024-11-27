import express from "express";
const router = express.Router();
import declarationPrealableController from "../../../controllers/SiteDetails/DP/DpController.js";

router.post('/create-dp-prospect',declarationPrealableController.createDp);
router.get('/:Proid/dps',declarationPrealableController.getAllDps);
router.get('/:Proid/active-dps',declarationPrealableController.getActiveDps);
router.get('/:Proid/inactive-dps',declarationPrealableController.getInactiveDps);
router.get('/:id',declarationPrealableController.getDpsById);
router.put('/:id',declarationPrealableController.updateDp);
router.patch('/:id/desactivate',declarationPrealableController.desactivateDp);
router.patch('/:id/activate',declarationPrealableController.activateDp);
export default router ; 