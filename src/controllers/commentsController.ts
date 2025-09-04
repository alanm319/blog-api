import { type Request, type Response } from "express";
import prismaClient from "../db/prismaClient.js";

export async function getComments(req: Request, res: Response) {
  const { postId } = req.params || {};
  const id = Number(postId);
  if (isNaN(id) || id < 0) {
    return res.status(400).json({message: "Invalid Post ID"});
  }
  try {
    const comments = await prismaClient.comment.findMany({
      where: {
        postId: id
      },
      include: {author: {select: {username: true}}},
      orderBy: { createdAt: 'asc'}
    });
    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Failed to get comments"});
  }
}

export async function postComment(req: Request, res: Response) {
  const { postId } = req.params || {};
  const id = Number(postId);
  if (isNaN(id) || id < 0) {
    return res.status(400).json({message: "Invalid Post ID"});
  }

  try {
    const userId = req.user?.id;
    const { content } = req.body;
    if (!content || !userId) {
      return res.status(400).json({message: "content and userId required"});
    }
    const comment = await prismaClient.comment.create({
      data: {
        postId: id,
        content,
        authorId: Number(userId)
      }
    });
    return res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Failed to post comment"});
  }
}