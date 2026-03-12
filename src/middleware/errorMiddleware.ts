import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      data: {
        issues: error.flatten(),
      },
      message: "Dados invalidos.",
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      data: {},
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    data: {},
    message: "Erro interno do servidor.",
  });
}
