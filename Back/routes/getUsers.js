import express from "express";
const router = express.Router();
import getUsersController from "../controllers/getUsersController.js";

router.get('/',getUsersController.getUserInfo);
export default router ; 