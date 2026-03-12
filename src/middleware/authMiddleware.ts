import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

type JwtPayload = {
  sub: string;
};

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token nao informado.", 401);
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    throw new AppError("Token invalido.", 401);
  }

  const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
  req.userId = Number(payload.sub);

  return next();
}
