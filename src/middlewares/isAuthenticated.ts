import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
  sub: string;
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).end();
  }

  if (authToken.includes("Bearer")) {
    authToken = authToken.split(" ")[1];
  }

  try {
    //validando o token
    const { sub } = verify(authToken, process.env.JWT_SECRET) as Payload;

    //recupera o id do usuário e guarda dentro do request para ser usado depois
    req.user_id = sub;

    return next();
  } catch (error) {
    return res.status(401).end();
  }
}
