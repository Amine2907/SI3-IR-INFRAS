import express from "express";
const router = express.Router();
import demRacController from "../../../controllers/SiteDetails/DR/DrController.js";
router.post('/create-demrac-site',demRacController.createDr);
router.put('/:id',demRacController.updatedr);
router.get('/:id',demRacController.getdrsById);
router.get('/:Sid/demracs',demRacController.getAlldrs);
router.get('/:Sid/active-demracs',demRacController.getAllActiveDrs);
router.get('/:Sid/inactive-demracs',demRacController.getAllInactiveDrs);
router.get('/:Sid/active-prospects',demRacController.fetchActiveProspects);
router.get('/:Sid/active-devis',demRacController.fetchActiveDevis);
router.patch('/:id/desactivate',demRacController.desactivateDr);
router.patch('/:id/activate',demRacController.activateDr);

export default router ; 