import { Request, Response } from "express";
import { z } from "zod";
import { UsuarioService } from "../../services/usuario/UsuarioService";
import { successResponse } from "../../utils/http";

const updateSchema = z.object({
  nome: z.string().min(3).optional(),
  email: z.string().email().optional(),
});

const changePasswordSchema = z.object({
  senha_atual: z.string().min(6),
  nova_senha: z.string().min(6),
});

export class UsuarioController {
  private service = new UsuarioService();

  me = async (req: Request, res: Response) => {
    const data = await this.service.me(req.userId!);

    return successResponse(res, {
      data,
      message: "Dados do usuario carregados com sucesso.",
    });
  };

  update = async (req: Request, res: Response) => {
    const body = updateSchema.parse(req.body);
    const data = await this.service.update(req.userId!, body);

    return successResponse(res, {
      data,
      message: "Usuario atualizado com sucesso.",
    });
  };

  changePassword = async (req: Request, res: Response) => {
    const body = changePasswordSchema.parse(req.body);
    await this.service.changePassword(req.userId!, body.senha_atual, body.nova_senha);

    return successResponse(res, {
      message: "Senha alterada com sucesso.",
    });
  };
}
