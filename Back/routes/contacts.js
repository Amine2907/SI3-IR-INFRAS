import express from "express";
const router = express.Router();
import contactController from "../controllers/contactsController.js";

router.post('/',contactController.createContact);
router.get('/',contactController.getAllContacts);
router.get('/search',contactController.searchContacts);
router.get('/:id',contactController.getContactsById);
router.put('/:id',contactController.updateContact);
router.patch('/:id/desactivate',contactController.desactivateContact);
router.patch('/:id/activate',contactController.activateContact);

export default router ; 