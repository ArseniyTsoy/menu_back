import express from "express";
import menuController from "../controllers/menu.js";

const router = express.Router();

router.get("/", menuController.getMount);

router.post("/add-position", menuController.postAddPosition);

router.post("/edit-position/:id", menuController.postEditPosition);

router.delete("/delete-position/:id", menuController.deletePosition);

export default router;