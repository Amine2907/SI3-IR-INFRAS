/**
 * This file contains the routes for the entities feature.
 * It provides endpoints for creating, getting, and searching entities.
 * The endpoints are:
 * - POST /api/entites: creates a new entity
 * - GET /api/entites: gets all the entities
 * - GET /api/entites/active: gets all the active entities
 * - GET /api/entites/inactive: gets all the inactive entities
 * - GET /api/entites/search: searches for entities
 * - GET /api/entites/:id: gets an entity by its ID
 */
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