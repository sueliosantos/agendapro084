import { NextFunction, Request, Response } from "express";
import prismaClient from "../prisma";

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const userId = Number(req.user_id);

  if (!userId) {
    return res.status(401).json({
      error: "Usuario nao autenticado",
    });
  }

  const user = await prismaClient.usuario.findUnique({
    where: {
      id: userId,
    },
    select: {
      tipo: true,
    },
  });

  if (!user || user.tipo !== "ADMIN") {
    return res.status(403).json({
      error: "Acesso negado",
    });
  }

  return next();
}
