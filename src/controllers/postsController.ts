import { type Request, type Response } from "express";
import prismaClient from "../db/prismaClient.js";
import { Prisma } from "@prisma/client"

export async function getPosts(_req: Request, res: Response) {
  try {
    const posts = await prismaClient.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        imageUrl: true,
        publishedAt: true,
      }
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get all posts "});
  }
}

export async function getPostById(req: Request, res: Response) {
  const { postId } = req.params;
  const id = Number(postId);
  
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid postId' });
  }
  
  const post = await prismaClient.post.findUnique({
    where: { id }
  });

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  return res.status(200).json(post);
}

export async function createPost(req: Request, res: Response) {
  // TODO: logic for images
  const imageUrl = "https://images.unsplash.com/photo-1569241705540-87831ea3e1bc?q=80&w=2420&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  // TODO: generate slug here
  try {
    if (!req.body) {
      res.status(400).json({ message: 'Request body required' });
    }
    const { title, slug, content, state, authorId } = req.body;

    if ( !title || !slug || !content || !authorId ) {
      return res.status(400).json({message: 'title, slug, content, authorId required'});
    }
    const post = await prismaClient.post.create({
      data: {
        title,
        slug,
        content,
        imageUrl,
        state,
        authorId: Number(authorId)
      }
    });
    return res.status(201).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Failed to create post'});
  }
}

export async function updatePost(req: Request, res: Response) {
  const { postId } = req.params;
  const id = Number(postId);
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'Request body required' });
    }
    const { title, slug, content, state, authorId } = req.body;

    if ( !title || !slug || !content || !authorId ) {
      return res.status(400).json({message: 'title, slug, content, authorId required'});
    }
    const post = await prismaClient.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        state,
        authorId: Number(authorId)
      }
    });
    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ message: 'Post not found'})
    }
    return res.status(500).json({ message: 'Failed to update post'});
  }
}

export async function deletePost(req: Request, res: Response) {
  const { postId } = req.params;
  const id = Number(postId);
  try {
    const deletedPost = await prismaClient.post.delete({
      where: { id }
    });
    return res.status(200).json(deletedPost);
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ message: 'Post not found'})
    }
    return res.status(500).json({ message: 'Failed to delete post'});
  }
}

