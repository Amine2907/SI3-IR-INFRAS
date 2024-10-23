import express from "express";
const router = express.Router();
import companyController from "../controllers/companyController.js";

router.post('/',companyController.createCompany);
router.get('/',companyController.getAllCompanys);
router.get('/active',companyController.getActiveCompanys);
router.get('/inactive',companyController.getInactiveCompanys);
router.get('/:id',companyController.getCompanysById);
router.put('/:id',companyController.updateCompany);
router.patch('/:id/desactivate',companyController.desactivateCompany);
router.patch('/:id/activate',companyController.activateCompany);

export default router ; 