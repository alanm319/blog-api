import express, { type Express } from "express";
import postsRouter from "./routes/postsRouter.js";
import authRouter from "./routes/authRouter.js";

const app: Express = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use('/posts', postsRouter);

const PORT = process.env.PORT ?? "9001";
app.listen(PORT, () => {
  console.log("app listening on port " + PORT);
});
