import { type Request, type Response } from "express";
import prismaClient from "../db/prismaClient.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


export async function signup(req: Request, res: Response) {
  const { username, password } = req.body || {};
  if (!username || !password ) {
    return res.status(400).json({ message: "email and password required" });
  }
  try {
    const foundUser = await prismaClient.user.findUnique({where: {username}});
    if (foundUser) {
      return res.status(400).json({ message: "username already in use" });
    }
    const passwordHash: string = await bcrypt.hash(password, 10);
    const user = await prismaClient.user.create({
      data: {username, password: passwordHash}
    });
    return res.status(201).json({ message: "User created", userId: user.id });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Internal server error", err: error});
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body || {};
    const user = await prismaClient.user.findUnique({ where: {username} });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRETKEY as string,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
    return;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", err: error });
  }
}