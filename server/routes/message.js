import controllers from "../controllers/message.js";
import express from "express";
const router = express.Router();

router.get("/:senderId/:receiverId", controllers.getMessages);
router.post("/createMessage", controllers.createMessage);

export default router;