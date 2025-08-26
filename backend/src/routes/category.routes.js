import express from "express";

import {
    addCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategory,
} from "../controllers/Category.controllers.js";

const router = express.Router();
router.post("/", addCategory)
router.get("/", getAllCategory);
router.get("/:id", getCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;