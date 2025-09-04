import { Router } from "express";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postsController.js";
import commentsRouter from "./commentsRouter.js";

const postsRouter: Router = Router();

postsRouter.get("/", getPosts);
postsRouter.get("/:postId", getPostById);
postsRouter.use('/:postId/comments', commentsRouter);

postsRouter.post("/", authenticate, authorizeAdmin, createPost);
postsRouter.put("/:postId",authenticate, authorizeAdmin, updatePost);
postsRouter.delete("/:postId", authenticate, authorizeAdmin, deletePost);



export default postsRouter;
