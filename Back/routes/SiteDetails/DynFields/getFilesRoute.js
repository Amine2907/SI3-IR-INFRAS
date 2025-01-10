import express from "express";
import fileDynFieldsController from "../../../models/SiteDetails/DynFields/getFilesController.js";
const router = express.Router();
router.get("/:Sid", fileDynFieldsController.checkFilesForAllComponent);
export default router;
