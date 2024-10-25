import express from "express";
const router = express.Router();
import getUsersController from "../controllers/getUsersController.js";

router.get('/',getUsersController.getUserInfo);
router.get('/display-name',getUsersController.getDisplayName);
export default router ; 