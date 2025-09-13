import { type Request, type Response } from "express";
import prismaClient from "../db/prismaClient.js";
import CustomError from "../util/CustomError.js";

export async function getComments(req: Request, res: Response) {
  const { postId } = req.params || {};
  const id = Number(postId);
  if (isNaN(id) || id < 0) {
    throw new CustomError("Invalid Post ID", 400);
  }
  const comments = await prismaClient.comment.findMany({
    where: {
      postId: id,
    },
    include: { author: { select: { username: true } } },
    orderBy: { createdAt: "asc" },
  });
  return res.status(200).json(comments);
}

export async function postComment(req: Request, res: Response) {
  const { postId } = req.params || {};
  const id = Number(postId);
  if (isNaN(id) || id < 0) {
    throw new CustomError("Invalid Post ID", 400);
  }

  const userId = req.user?.id;
  const { content } = req.body;
  if (!content || !userId) {
    throw new CustomError("Comment Content and User ID required", 400);
  }
  const comment = await prismaClient.comment.create({
    data: {
      postId: id,
      content,
      authorId: Number(userId),
    },
  });
  return res.status(200).json(comment);
}
