import { Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "../../services/auth/AuthService";
import { successResponse } from "../../utils/http";

const registerSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(10),
  senha: z.string().min(6),
});

type RegisterBody = {
  nome: string;
  email: string;
  senha: string;
};

type LoginBody = {
  email: string;
  senha: string;
};

type ForgotPasswordBody = {
  email: string;
};

type ResetPasswordBody = {
  token: string;
  senha: string;
};

export class AuthController {
  private service = new AuthService();

  register = async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body) as RegisterBody;
    const data = await this.service.register(body);

    return successResponse(res, {
      statusCode: 201,
      data,
      message: "Usuario cadastrado com sucesso.",
    });
  };

  login = async (req: Request, res: Response) => {
    const body = loginSchema.parse(req.body) as LoginBody;
    const data = await this.service.login(body);

    return successResponse(res, {
      data,
      message: "Login realizado com sucesso.",
    });
  };

  forgotPassword = async (req: Request, res: Response) => {
    const body = forgotPasswordSchema.parse(req.body) as ForgotPasswordBody;
    const data = await this.service.forgotPassword(body.email);

    return successResponse(res, {
      data,
      message: "Se o email existir, as instrucoes de recuperacao foram geradas.",
    });
  };

  resetPassword = async (req: Request, res: Response) => {
    const body = resetPasswordSchema.parse(req.body) as ResetPasswordBody;
    await this.service.resetPassword(body.token, body.senha);

    return successResponse(res, {
      message: "Senha redefinida com sucesso.",
    });
  };
}
