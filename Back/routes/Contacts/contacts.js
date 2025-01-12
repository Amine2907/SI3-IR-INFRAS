/**
 * This route is used to create a new contact
 * @swagger
 * /:
 *   post:
 *     summary: Create a new contact
 *     tags:
 *       - Contacts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               tel:
 *                 type: string
 *               mobile:
 *                 type: string
 *               mission:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact created
 *       400:
 *         description: Bad request
 *
 * /:
 *   get:
 *     summary: Get all contacts
 *     tags:
 *       - Contacts
 *     responses:
 *       200:
 *         description: Return a list of all contacts
 *       400:
 *         description: Bad request
 *
 * /active:
 *   get:
 *     summary: Get all active contacts
 *     tags:
 *       - Contacts
 *     responses:
 *       200:
 *         description: Return a list of all active contacts
 *       400:
 *         description: Bad request
 *
 * /inactive:
 *   get:
 *     summary: Get all inactive contacts
 *     tags:
 *       - Contacts
 *     responses:
 *       200:
 *         description: Return a list of all inactive contacts
 *       400:
 *         description: Bad request
 *
 * /search:
 *   get:
 *     summary: Search contacts by name or email
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: the value to search
 *     responses:
 *       200:
 *         description: Return a list of all contacts that match the search query
 *       400:
 *         description: Bad request
 *
 * /:id:
 *   get:
 *     summary: Get one contact by its id
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the contact to get
 *     responses:
 *       200:
 *         description: Return the contact with the corresponding id
 *       400:
 *         description: Bad request
 *
 * /:id:
 *   patch:
 *     summary: Update one contact by its id
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the contact to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               tel:
 *                 type: string
 *               mobile:
 *                 type: string
 *               mission:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Contact not found
 */
import express from "express";
const router = express.Router();
import contactController from "../../controllers/Contacts/contactsController.js";

router.post('/',contactController.createContact);
router.get('/',contactController.getAllContacts);
router.get('/active',contactController.getActiveContacts);
router.get('/inactive',contactController.getInactiveContacts);
router.get('/search',contactController.searchContacts);
router.get('/:id',contactController.getContactsById);
router.put('/:id',contactController.updateContact);
router.patch('/:id/desactivate',contactController.desactivateContact);
router.patch('/:id/activate',contactController.activateContact);

export default router ; 