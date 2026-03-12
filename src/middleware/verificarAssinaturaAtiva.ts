import { NextFunction, Request, Response } from "express";
import { StatusAssinatura } from "@prisma/client";
import { prisma } from "../prisma";
import { AppError } from "../utils/AppError";

export async function verificarAssinaturaAtiva(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const assinatura = await prisma.assinatura.findFirst({
    where: {
      usuarioId: req.userId,
      status: StatusAssinatura.ATIVO,
      dataExpiracao: {
        gte: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!assinatura) {
    throw new AppError("Assinatura inativa ou expirada.", 403);
  }

  return next();
}
