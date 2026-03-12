import { Response } from "express";

type SuccessOptions = {
  statusCode?: number;
  data?: unknown;
  message?: string;
};

export function successResponse(
  res: Response,
  { statusCode = 200, data = {}, message = "" }: SuccessOptions
) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}
