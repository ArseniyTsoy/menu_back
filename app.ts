import { Request, Response, NextFunction } from 'express';
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import history from "connect-history-api-fallback";
import express from "express";
import multer from "multer";
import menuRoutes from "./routes/menu.js";

// Constructing __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(history());

// Parser
app.use(express.json());

// Static folder for images
app.use("/images", express.static(path.join(__dirname, "images")));

// Image upload
const fileStorage = multer.diskStorage({
  destination(_, _2, cb) {
    cb(null, "images");
  },
  filename(_, file, cb) {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  }
});

app.use(multer({
  storage: fileStorage
}).single("image"));

// Routes
app.use(menuRoutes);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  return res.send("<h3>Oops!</h3><p>Something went wrong!</p>");
});

// Launching the server
app.listen(3000, () => {
  console.log("The app is running on port 3000!");
});