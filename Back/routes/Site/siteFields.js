import express from "express";
const router = express.Router();
import siteFieldsController from "../../controllers/Site/siteDynFieldsController.js";
router.get('/:Sid/prospect-retenu',siteFieldsController.getPropsectRetenu);
router.get('/:Sid/dr-date',siteFieldsController.getDrDate);
router.get('/:Sid/devis-date',siteFieldsController.getDevisDate);
router.get('/:Sid/reglement-date',siteFieldsController.getReglementDate);
router.get('/:Sid/mes-date',siteFieldsController.getMesDate);

export default router ; 