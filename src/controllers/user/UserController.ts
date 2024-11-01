import { Request, Response } from "express";
import { UseService } from "../../services/user/UserService";


class UserController {
  async handle(req: Request, res: Response) {
    const { nome, email, senha, ativo } = req.body;

    const service = new UseService();

    const user = await service.execute({ nome, email, senha, ativo });

    return res.json(user);
  }
}

export { UserController };
