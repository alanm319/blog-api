import { Router } from "express";
import { getPosts, getPostById, createPost, updatePost, deletePost } from '../controllers/postsController.js'
const postsRouter = Router();

postsRouter.get('/', getPosts);
postsRouter.get('/:postId', getPostById);
postsRouter.post('/', createPost);
postsRouter.put('/:postId', updatePost);
postsRouter.delete('/:postId', deletePost);

export default postsRouter;