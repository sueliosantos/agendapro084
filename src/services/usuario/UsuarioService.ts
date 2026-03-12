import { prisma } from "../../prisma";
import { AppError } from "../../utils/AppError";
import { comparePassword, hashPassword } from "../../utils/password";

type UpdateUserInput = {
  nome?: string;
  email?: string;
};

export class UsuarioService {
  async me(userId: number) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
      },
    });

    if (!usuario) {
      throw new AppError("Usuario nao encontrado.", 404);
    }

    return usuario;
  }

  async update(userId: number, data: UpdateUserInput) {
    if (data.email) {
      const emailEmUso = await prisma.usuario.findFirst({
        where: {
          email: data.email,
          NOT: {
            id: userId,
          },
        },
      });

      if (emailEmUso) {
        throw new AppError("Email ja esta em uso.", 409);
      }
    }

    return prisma.usuario.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async changePassword(userId: number, senhaAtual: string, novaSenha: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuario) {
      throw new AppError("Usuario nao encontrado.", 404);
    }

    const senhaValida = await comparePassword(senhaAtual, usuario.senha);

    if (!senhaValida) {
      throw new AppError("Senha atual incorreta.", 400);
    }

    await prisma.usuario.update({
      where: { id: userId },
      data: {
        senha: await hashPassword(novaSenha),
      },
    });
  }
}
