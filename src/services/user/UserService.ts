import prismaClient from '../../prisma';
import { hash } from 'bcryptjs';

interface UserRequest {
  nome: string;
  email: string;
  senha: string;
  ativo: boolean;
}

class UseService {
  async execute({ nome, email, senha, ativo }: UserRequest) {
    if (!email) {
      throw new Error('Email incorreto');
    }

    const emailJaExiste = await prismaClient.usuario.findFirst({
      where: {
        email: email
      }
    });

    if (emailJaExiste) {
      throw new Error('Usuário já cadastrado');
    }

    const user = await prismaClient.usuario.create({
      data: {
        nome,
        email,
        senha,
        ativo
      },
      select: {
        id: true,
        nome: true,
        email: true,
        ativo: true
      }
    });

    return user;
  }
}

export { UseService };
