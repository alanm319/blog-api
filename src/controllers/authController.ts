import { type Request, type Response } from "express";
import prismaClient from "../db/prismaClient.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import CustomError from "../util/CustomError.js";

export async function signup(req: Request, res: Response) {
  const { username, password } = req.body || {};
  if (!username || !password) {
    throw new CustomError("Email and password required", 400);
  }

  const foundUser = await prismaClient.user.findUnique({ where: { username } });
  if (foundUser) {
    throw new CustomError("Username already in use", 400);
  }
  const passwordHash: string = await bcrypt.hash(password, 10);
  const user = await prismaClient.user.create({
    data: { username, password: passwordHash },
  });
  return res.status(201).json({ message: "User created", userId: user.id });
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body || {};
  if (!username || !password) {
    throw new CustomError("username and password required", 400);
  }
  const user = await prismaClient.user.findUnique({ where: { username } });
  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new CustomError("Invalid credentials", 400);
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.SECRETKEY as string,
    { expiresIn: "1h" }
  );

  return res.status(200).json({ token });
}
