import express from "express";
const router = express.Router();
import traveauxController from "../../../controllers/SiteDetails/Traveaux/TraveauxController.js";
router.post('/create-trav-site',traveauxController.createTraveau);
router.put('/:id',traveauxController.updateTrav);
router.get('/:id',traveauxController.getTravById);
router.get('/:Sid/trav',traveauxController.getAllTravx);
router.get('/:Sid/active-trav',traveauxController.getActiveTravs);
router.get('/:Sid/inactive-trav',traveauxController.getInactiveTravs);
router.patch('/:id/desactivate',traveauxController.desactivateTrav);
router.patch('/:id/activate',traveauxController.activateTrav);

export default router; 