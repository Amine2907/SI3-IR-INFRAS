/**
 * This file contains the routes for the Companys feature.
 * It provides endpoints for creating, getting, and updating Companys.
 * The endpoints are:
 * - POST /api/companies: creates a new Company
 * - GET /api/companies: gets all the Companys
 * - GET /api/companies/active: gets all the active Companys
 * - GET /api/companies/inactive: gets all the inactive Companys
 * - GET /api/companies/:id: gets a Company by its ID
 * - PUT /api/companies/:id: updates a Company
 * - PATCH /api/companies/:id/desactivate: deactivates a Company
 * - PATCH /api/companies/:id/activate: activates a Company
 */
import express from "express";
const router = express.Router();
import companyController from "../../controllers/Company/companyController.js";

router.post('/',companyController.createCompany);
router.get('/',companyController.getAllCompanys);
router.get('/active',companyController.getActiveCompanys);
router.get('/inactive',companyController.getInactiveCompanys);
router.get('/:id',companyController.getCompanysById);
router.put('/:id',companyController.updateCompany);
router.patch('/:id/desactivate',companyController.desactivateCompany);
router.patch('/:id/activate',companyController.activateCompany);

export default router ; 