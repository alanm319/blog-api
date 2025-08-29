import express, { type Express } from "express";
import postsRouter from "./routes/postsRouters.js";

const app: Express = express();
app.use(express.json());
app.use('/posts', postsRouter);

const PORT = process.env.PORT ?? "9001";
app.listen(PORT, () => {
  console.log("app listening on port " + PORT);
});
