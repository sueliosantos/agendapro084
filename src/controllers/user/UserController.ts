import { Request, Response } from "express";
import { UserService } from "../../services/user/UserService";

class UserController {
  async handle(req: Request, res: Response) {
    const {
      nome,
      email,
      senha,
      ativo,
      nomeSocial,
      telefone,
      cpf,
      tipo,
      plano,
      validade,
      linkFoto,
    } = req.body;

    const service = new UserService();
    const user = await service.execute({
      nome,
      email,
      senha,
      ativo,
      nomeSocial,
      telefone,
      cpf,
      tipo,
      plano,
      validade: validade ? new Date(validade) : undefined,
      linkFoto,
    });

    return res.status(201).json(user);
  }

  async updateMe(req: Request, res: Response) {
    const userId = Number(req.user_id);
    const { nome, email, senha, nomeSocial, telefone, cpf, linkFoto } = req.body;

    const service = new UserService();
    const user = await service.editar({
      id: userId,
      nome,
      email,
      senha,
      nomeSocial,
      telefone,
      cpf,
      linkFoto,
    });

    return res.json(user);
  }

  async updatePlano(req: Request, res: Response) {
    const { id } = req.params;
    const { plano, validade } = req.body;

    const service = new UserService();
    const user = await service.atualizarPlano(
      Number(id),
      plano,
      validade ? new Date(validade) : null
    );

    return res.json(user);
  }

  async alterarSenha(req: Request, res: Response) {
    const userId = Number(req.user_id);
    const { senha } = req.body;

    const service = new UserService();
    const user = await service.alterarSenha(userId, senha);

    return res.json(user);
  }

  async adminList(req: Request, res: Response) {
    const service = new UserService();
    const users = await service.listarTodosAdmin();

    return res.json(users);
  }

  async adminUpdate(req: Request, res: Response) {
    const { id } = req.params;
    const {
      nome,
      email,
      ativo,
      nomeSocial,
      telefone,
      cpf,
      tipo,
      plano,
      validade,
      linkFoto,
    } = req.body;

    const service = new UserService();
    const user = await service.editar({
      id: Number(id),
      nome,
      email,
      ativo:
        ativo === undefined ? undefined : ativo === true || ativo === "true",
      nomeSocial,
      telefone,
      cpf,
      tipo,
      plano,
      validade:
        validade === "" || validade === null || validade === undefined
          ? null
          : new Date(validade),
      linkFoto,
    });

    return res.json(user);
  }
}

export { UserController };
