import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

async function signup (req: Request, res: Response, next: NextFunction) {
  const { email, name, password } = req.body;

  const userCheck = await prisma.user.findFirst({
    where: {
      email: email
    }
  });

  if (userCheck) {
    return res.status(401).json({
      message: "E-Mail уже зарегистрирован!"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword
    }
  });
  
  const token = jwt.sign(
    {
      email: newUser.email,
      userId: newUser.id
    },
    "somesecretkey",
    { expiresIn: "1h" }
  );

  return res.status(201).json({
    token,
    userId: newUser.id,
    userName: newUser.name
  });
};

async function login (req: Request, res: Response) {
  const { email, password } = req.body;

  let authenticatedUser = await prisma.user.findFirst({
    where: { 
      email: email
    }
  });

  if (!authenticatedUser) {
    return res.status(401).json({
      emailError: "E-Mail не найден!"
    });
  }
        
  const isEqual = await bcrypt.compare(password, authenticatedUser.password);
        
  if (!isEqual) {
    return res.status(401).json({
      passwordError: "Неверный пароль"
    });
  }
        
  const token = jwt.sign(
    {
      email: authenticatedUser.email,
      userId: authenticatedUser.id
    },
    "somesecretkey",
    { expiresIn: "1h" }
  );

  return res.status(200).json({
    token,
    userId: authenticatedUser.id,
    userName: authenticatedUser.name
  });
};

export default {
  signup,
  login
};