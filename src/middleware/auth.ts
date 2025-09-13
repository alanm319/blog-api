import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../util/CustomError.js";

interface JwtPayload {
  id: number,
  role: string,
  iat: number,
  exp: number,
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'] as string | undefined;
  if (!authHeader) {
    throw new CustomError("Auth header required", 401);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new CustomError("No token provided", 401);
  }
    const payload = jwt.verify(token, process.env.SECRETKEY as string) as JwtPayload;
    req.user = { id: payload.id, role: payload.role };
    next();
}

export function authorizeAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    throw new CustomError("Not authinticated", 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new CustomError("Not authorized", 403);
  }
  next();
  return;
}