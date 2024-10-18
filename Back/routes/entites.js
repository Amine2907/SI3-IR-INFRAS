import express from "express";
const router = express.Router();
import entityController from "../controllers/entiteController.js";

router.post('/',entityController.createEntite);
router.get('/',entityController.getAllEntites);
router.get('/active',entityController.getActiveEntites);
router.get('/inactive',entityController.getInactiveEntites);
router.get('/search',entityController.searchEntites);
router.get('/:id',entityController.getEntityById);
router.put('/:id',entityController.updateEntity);
router.patch('/:id/desactivate',entityController.desactivateEntity);
router.patch('/:id/activate',entityController.activateEntity);

export default router ; 