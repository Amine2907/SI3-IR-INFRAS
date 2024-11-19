import express from "express";
const router = express.Router();

import siteContactCntrl from "../../controllers/Site/siteContactController.js";
router.post('/add-contact-site',siteContactCntrl.addContactSite);
router.delete('/delete-contact-site',siteContactCntrl.deleteContactSite);
router.get('/:Sid/contacts',siteContactCntrl.getSiteContacts);
router.get('/:Sid/contact',siteContactCntrl.displayContactsSite);

export default router ; 