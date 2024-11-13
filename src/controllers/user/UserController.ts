import { Request, Response } from 'express';
import { UseService } from '../../services/user/UserService';
import { hash } from 'bcryptjs';

class UserController {
  async handle(req: Request, res: Response) {
    const { nome, email, senha, ativo } = req.body;

    const service = new UseService();

    const senhaHast = await hash(senha, 8);

    const user = await service.execute({ nome, email, senha: senhaHast, ativo });

    return res.json(user);
  }
}

export { UserController };
