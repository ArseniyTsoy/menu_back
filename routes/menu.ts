import express from "express";
import menuController from "../controllers/menu.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.get("/", menuController.getMount);

router.post("/add-position", isAuth, menuController.postAddPosition);

router.post("/edit-position/:id", isAuth, menuController.postEditPosition);

router.delete("/delete-position/:id", isAuth, menuController.deletePosition);

export default router;