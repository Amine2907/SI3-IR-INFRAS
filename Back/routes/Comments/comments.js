import express from "express";
const router = express.Router();
import genericController from "../../controllers/Comments/genericController.js";
// Create a new record in any table
router.post('/:table', genericController.create);

// Get all records from any table
router.get('/:table', genericController.getAll);

// Get a single record by ID from any table
router.get('/:table/:id', genericController.getById);

// Update a record by ID in any table
router.put('/:table/:id', genericController.update);

// Delete a record by ID from any table
router.delete('/:table/:id', genericController.delete);

export default router;
