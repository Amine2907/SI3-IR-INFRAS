import express from "express";
const router = express.Router();
import prospectController from "../../../controllers/SiteDetails/Prospect/ProspectController.js";

router.post('/create-prospect-site',prospectController.createProspect);
router.get('/',prospectController.getAllProspects);
router.get('/active',prospectController.getActiveProspects);
router.get('/inactive',prospectController.getInactiveProspects);
router.get('/:id',prospectController.getprospectsById);
router.put('/:id',prospectController.updateprospect);
router.patch('/:id/desactivate',prospectController.desactivateProspect);
router.patch('/:id/activate',prospectController.activateProspect);

export default router ; 