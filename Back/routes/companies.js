import express from "express";
const router = express.Router();
import CompanyController from "../controllers/companyController";

router.post('/',CompanyController.createCompany);
router.get('/',CompanyController.getAllCompanys);
router.get('/active',CompanyController.getActiveCompanys);
router.get('/inactive',CompanyController.getInactiveCompanys);
router.get('/:id',CompanyController.getCompanysById);
router.put('/:id',CompanyController.updateCompany);
router.patch('/:id/desactivate',CompanyController.desactivateCompany);
router.patch('/:id/activate',CompanyController.activateCompany);

export default router ; 