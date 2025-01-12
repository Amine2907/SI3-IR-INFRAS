import express from "express";
const router = express.Router();
import prospectController from "../../../controllers/SiteDetails/Prospect/ProspectController.js";

router.post('/create-prospect-site',prospectController.createProspect);
router.get('/:Sid/prospects',prospectController.getAllProspects);
router.get('/:Sid/active-prospects',prospectController.getActiveProspects);
router.get('/:Sid/inactive-prospects',prospectController.getInactiveProspects);
router.get('/:id',prospectController.getprospectsById);
router.put('/:id',prospectController.updateprospect);
router.patch('/:id/desactivate',prospectController.desactivateProspect);
router.patch('/:id/activate',prospectController.activateProspect);
export default router ; 