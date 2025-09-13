import { type Request, type Response } from "express";
import prismaClient from "../db/prismaClient.js";
import CustomError from "../util/CustomError.js";

export async function getPosts(_req: Request, res: Response) {
  const posts = await prismaClient.post.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      imageUrl: true,
      publishedAt: true,
    },
  });
  res.status(200).json(posts);
}

export async function getPostById(req: Request, res: Response) {
  const { postId } = req.params;
  const id = Number(postId);

  if (isNaN(id)) {
    throw new CustomError("Invalid Post ID", 400);
  }

  const post = await prismaClient.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new CustomError("Post not found", 404);
  }
  return res.status(200).json(post);
}

export async function createPost(req: Request, res: Response) {
  // TODO: logic for images
  const imageUrl =
    "https://images.unsplash.com/photo-1569241705540-87831ea3e1bc?q=80&w=2420&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  // TODO: generate slug here
  if (!req.body) {
    throw new CustomError("Request body required", 400);
  }
  const { title, slug, content, state, authorId } = req.body;

  if (!title || !slug || !content || !authorId) {
    throw new CustomError("title, slug, content, authorId required", 400);
  }
  const post = await prismaClient.post.create({
    data: {
      title,
      slug,
      content,
      imageUrl,
      state,
      authorId: Number(authorId),
    },
  });
  return res.status(201).json(post);
}

export async function updatePost(req: Request, res: Response) {
  const { postId } = req.params;
  const id = Number(postId);
  if (!req.body) {
    throw new CustomError("Request body required", 400);
  }
  const { title, slug, content, state, authorId } = req.body;

  if (!title || !slug || !content || !authorId) {
    throw new CustomError("title, slug, content, authorId required", 400);
  }
  const post = await prismaClient.post.update({
    where: { id },
    data: {
      title,
      slug,
      content,
      state,
      authorId: Number(authorId),
    },
  });
  return res.status(200).json(post);
}

export async function deletePost(req: Request, res: Response) {
  const { postId } = req.params;
  const id = Number(postId);

  const deletedPost = await prismaClient.post.delete({
    where: { id },
  });
  return res.status(200).json(deletedPost);
}
