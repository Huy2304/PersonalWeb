import express from "express";
import {
    sharePost,
    updateSharePost,
    deleteSharePost,
    getAllShares
} from "../controllers/Share.controllers.js";
import {validateBody} from "../middleware/validateBody.js";

const router = express.Router();
router.get("/:user_id", getAllShares);
router.put("/", updateSharePost);
router.delete("/:share_id", deleteSharePost);
router.post("/", sharePost);

export default router;