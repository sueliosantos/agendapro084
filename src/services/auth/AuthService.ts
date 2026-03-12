import { prisma } from "../../prisma";
import { AppError } from "../../utils/AppError";
import { generateToken } from "../../utils/jwt";
import { comparePassword, hashPassword } from "../../utils/password";
import { createResetToken, hashResetToken } from "../../utils/resetToken";

type RegisterInput = {
  nome: string;
  email: string;
  senha: string;
};

type LoginInput = {
  email: string;
  senha: string;
};

export class AuthService {
  async register({ nome, email, senha }: RegisterInput) {
    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("Email ja cadastrado.", 409);
    }

    const senhaHash = await hashPassword(senha);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        assinaturas: {
          create: {
            plano: "TRIAL",
            status: "ATIVO",
            dataInicio: new Date(),
            dataExpiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
      },
    });

    const token = generateToken(usuario.id);

    return { usuario, token };
  }

  async login({ email, senha }: LoginInput) {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: {
        assinaturas: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (!usuario) {
      throw new AppError("Credenciais invalidas.", 401);
    }

    const senhaValida = await comparePassword(senha, usuario.senha);

    if (!senhaValida) {
      throw new AppError("Credenciais invalidas.", 401);
    }

    const token = generateToken(usuario.id);

    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        created_at: usuario.createdAt,
        assinatura: usuario.assinaturas[0] || null,
      },
      token,
    };
  }

  async forgotPassword(email: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return {
        preview: null,
      };
    }

    const { token, tokenHash, expiresAt } = createResetToken();

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        resetPasswordToken: tokenHash,
        resetPasswordExpiresAt: expiresAt,
      },
    });

    console.log(
      `[RESET_PASSWORD] Enviar email para ${email} com token ${token} valido ate ${expiresAt.toISOString()}`
    );

    return {
      preview: {
        email,
        token,
        expires_at: expiresAt,
      },
    };
  }

  async resetPassword(token: string, senha: string) {
    const tokenHash = hashResetToken(token);

    const usuario = await prisma.usuario.findFirst({
      where: {
        resetPasswordToken: tokenHash,
        resetPasswordExpiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!usuario) {
      throw new AppError("Token invalido ou expirado.", 400);
    }

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        senha: await hashPassword(senha),
        resetPasswordToken: null,
        resetPasswordExpiresAt: null,
      },
    });
  }
}
