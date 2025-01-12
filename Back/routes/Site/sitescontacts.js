import express from "express";
const router = express.Router();

import siteContactCntrl from "../../controllers/Site/siteContactController.js";
router.post('/add-contact-site',siteContactCntrl.addExisitngSiteContact);
router.delete('/delete-contact-site',siteContactCntrl.deleteContactSite);
router.get('/:Sid/contacts',siteContactCntrl.getSiteContacts);
router.get('/:Sid/contact',siteContactCntrl.displayContactsSite);
router.post('/add-new-contact-site',siteContactCntrl.addNewContactSite);

export default router ; 