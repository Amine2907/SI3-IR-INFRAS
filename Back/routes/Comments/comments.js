// routes/commentRoutes.js
import express from "express";
const router = express.Router();
import commentController from "../../controllers/Comments/genericController.js";

// Route to add a comment
router.post('/comments', commentController.addComment);

// Route to get comments for an entity
router.get('/comments', commentController.getComments);

export default router;
