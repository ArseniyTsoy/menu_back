import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  const token = req.get("Authorization");

  if (!token) {
    return res.status(401).json({
      message: "Пользователь не авторизован!"
    })
  }

  jwt.verify(token, "somesecretkey", function(err) {
    if (err) {
      return res.status(401).json({
        message: "Токен недействителен!"
      });
    } else {
      return next();
    }
  });
};