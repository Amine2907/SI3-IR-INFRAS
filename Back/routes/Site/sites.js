/**
 * This file contains the routes for the sites feature.
 * It provides endpoints for creating, getting, and updating sites.
 * The endpoints are:
 * - POST /api/companies: creates a new site
 * - GET /api/companies: gets all the sites
 * - GET /api/companies/active: gets all the active sites
 * - GET /api/companies/inactive: gets all the inactive sites
 * - GET /api/companies/:id: gets a site by its ID
 * - PUT /api/companies/:id: updates a site
 * - PATCH /api/companies/:id/desactivate: deactivates a site
 * - PATCH /api/companies/:id/activate: activates a site
 */
import express from "express";
const router = express.Router();
import siteController from "../../controllers/Site/siteController.js";

router.post('/',siteController.createsite);
router.get('/',siteController.getAllsites);
router.get('/active',siteController.getActivesites);
router.get('/inactive',siteController.getInactivesites);
router.get('/search',siteController.searchsites);
router.get('/:EB',siteController.getsitesById);
router.put('/:EB',siteController.updatesite);
router.patch('/:EB/desactivate',siteController.desactivatesite);
router.patch('/:EB/activate',siteController.activatesite);

export default router ; 