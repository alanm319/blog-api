import express from "express";
import {type Express, type Request, type Response, type NextFunction} from "express";
import postsRouter from "./routes/postsRouter.js";
import authRouter from "./routes/authRouter.js";
import cors from 'cors';
import errorHandler from "./middleware/errorHandler.js";

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/posts', postsRouter);

app.use(errorHandler);

const PORT = process.env.PORT ?? "9001";
app.listen(PORT, () => {
  console.log("app listening on port " + PORT);
});
