import express from "express";
const router = express.Router();
import demRacController from "../../../controllers/SiteDetails/DR/DrController.js";
router.post('/',demRacController.createDr);
router.get('/',demRacController.getAlldrs);
router.get('/active',demRacController.getAllActiveDrs);
router.get('/inactive',demRacController.getAllInactiveDrs);
router.get('/:Sid/active-entites',demRacController.fetchActiveEntites);
router.get('/:Sid/active-prospects',demRacController.fetchActiveProspects);
router.get('/:Sid/active-devis',demRacController.fetchActiveDevis);
router.get('/:id',demRacController.getdrsById);
router.put('/:id',demRacController.updatedr);
router.patch('/:id/desactivate',demRacController.desactivateDr);
router.patch('/:id/activate',demRacController.activateDr);

export default router ; 