import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Prisma } from "../generated/prisma/index.js";

import CustomError from "../util/CustomError.js";

function handlePrismaError(err: Prisma.PrismaClientKnownRequestError) {
  switch (err.code) {
    case 'P2002':
      return new CustomError(`Duplicate field value: ${err.meta?.target ?? 'unknown'}`, 400);
    case 'P2014':
      return new CustomError(`Invalid ID: ${err.meta?.target || 'unknow'}`, 400);
    case 'P2003':
      return new CustomError(`Invalid input data: ${err.meta?.target || 'unknow'}`, 400);
    case 'P2025':
      return new CustomError(`No Record found for an update`, 404);
    default:
      return new CustomError(`Something went wrong: ${err.message}`, 500);
  }
}

function handleJwtError(err: jwt.JsonWebTokenError) {
  if (err instanceof jwt.NotBeforeError) {
    return new CustomError("Token not active yet", 401);
  } else if (err instanceof jwt.TokenExpiredError) {
    return new CustomError("Token Expired", 401);
  } else {
    return new CustomError("Invalid Token", 401);
  }
}

function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);

  let error: CustomError;
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error("handlePrismaError");
    error = handlePrismaError(err);
  } else if (err instanceof jwt.JsonWebTokenError) {
    console.error("jwt error");
    error = handleJwtError(err)
  } else if(err instanceof CustomError) {
    error = err;
  } else {
    error = new CustomError(err.message || "Internal Server Error", 500);
  }
  
  res.status(error.status).json({
    status: error.status,
    message: error.message
  });
}

export default errorHandler;