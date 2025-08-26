import express from "express";
import {toggleInteraction} from "../controllers/Interaction.controllers.js";

const router = express.Router();

router.post("/", toggleInteraction);

export default router;
