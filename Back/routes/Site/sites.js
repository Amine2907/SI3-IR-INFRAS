import express from "express";
const router = express.Router();
import siteController from "../../controllers/Site/siteController.js";

router.post('/',siteController.createsite);
router.get('/',siteController.getAllsites);
router.get('/:Sid/dp-data',siteController.fetchDpData);
router.get('/active',siteController.getActivesites);
router.get('/inactive',siteController.getInactivesites);
router.get('/search',siteController.SearchSites);
router.get('/active-companies',siteController.fetchActiveCompanies);
router.get('/:EB',siteController.getsitesById);
router.put('/:EB',siteController.updatesite);
router.patch('/:EB/desactivate',siteController.desactivateSite);
router.patch('/:EB/activate',siteController.activateSite);

export default router ;