import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number,
  role: string,
  iat: number,
  exp: number,
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'] as string | undefined;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const payload = jwt.verify(token, process.env.SECRETKEY as string) as JwtPayload;
    req.user = { id: payload.id, role: payload.role };
    next();
    return;
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

export function authorizeAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: "Forbidden: Admin Only" });
  }
  next();
  return;
}