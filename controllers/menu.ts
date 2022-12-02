import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function getMount (req: Request, res: Response) {
  const positions = await prisma.position.findMany();
  const categories = await prisma.category.findMany();
  return res.json({ positions, categories });
}

async function postAddPosition(req: Request, res: Response) {
  const { title, description } = req.body;
  const price = parseInt(req.body.price);
  const categoryId = parseInt(req.body.categoryId);
  const imageUrl = req.file!.path;

  const result = await prisma.position.create({
    data: {
      title,
      description,
      imageUrl,
      price,
      categoryId
    }
  });

  return res.json(result);
}

async function postEditPosition(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const { title, description, oldImageUrl } = req.body;
  const price = parseInt(req.body.price);
  const categoryId = parseInt(req.body.categoryId);
  
  let imageUrl = oldImageUrl;
  
  if (req.file) {
    imageUrl = req.file.path;

    fs.unlink(oldImageUrl, err => {
      if (err) throw (err);
    });
  }

  const result = await prisma.position.update({
    where: {
      id: id
    },
    data: {
      title,
      description,
      imageUrl,
      price,
      categoryId
    }
  });

  return res.json(result);
}

async function deletePosition(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const position = await prisma.position.findUnique({
    where: {
      id: id
    }
  });

  const result = await prisma.position.delete({
    where: {
      id: id
    }
  });

  fs.unlink(position!.imageUrl, err => {
    if (err) throw (err);
  });

  return res.json(result);
}

export default {
  getMount,
  postAddPosition,
  postEditPosition,
  deletePosition
};