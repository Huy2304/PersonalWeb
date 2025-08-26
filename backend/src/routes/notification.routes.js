import express from "express";

import {
    addNotification,
    deleteNotification,
    getAllNotifications,
    getNotificationById,
} from "../controllers/Notification.controllers.js";

const router = express.Router();
router.post("/", addNotification);
router.delete("/:id", deleteNotification);
router.get("/", getAllNotifications);
router.get("/:id", getNotificationById);

export default router;