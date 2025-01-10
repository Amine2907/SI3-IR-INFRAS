import express from "express";
import fileDynFieldsController from "../../../models/SiteDetails/DynFields/getFilesController.js";
const router = express.Router();

router.get("/:component/:componentId", fileDynFieldsController.checkFilesForComponent);

export default router;
