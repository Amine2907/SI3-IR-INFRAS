import express from "express";
const router = express.Router();
import PreEtudeController from "../../../controllers/SiteDetails/PreEtude/PreEtudeController.js";

router.post('/create-preetude-site',PreEtudeController.createPreEtude);
router.get('/:Sid/preetude',PreEtudeController.getAllPreEtudes);
router.get('/:Sid/active-preetudes',PreEtudeController.getActivePreEtudes);
router.get('/:Sid/inactive-preetudes',PreEtudeController.getInactivePreEtudes);
router.get('/:id',PreEtudeController.getPreEtudesById);
router.put('/:id',PreEtudeController.updatePreEtude);
router.patch('/:id/desactivate',PreEtudeController.desactivatePreEtude);
router.patch('/:id/activate',PreEtudeController.activatePreEtude);
export default router ; 