import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import prismaClient from "../../prisma";

interface AuthRequest {
  email: string;
  senha: string;
}

class AuthUserService {
  async execute({ email, senha }: AuthRequest) {
    if (!email) {
      throw new Error("Email obrigatorio");
    }

    if (!senha) {
      throw new Error("Senha obrigatoria");
    }

    const user = await prismaClient.usuario.findFirst({
      where: {
        email: email.trim().toLowerCase(),
      },
      select: {
        id: true,
        nome: true,
        email: true,
        senha: true,
        ativo: true,
        tipo: true,
        nomeSocial: true,
        telefone: true,
        cpf: true,
        linkFoto: true,
        plano: true,
        validade: true,
      },
    });

    if (!user) {
      throw new Error("Usuario/senha incorreto");
    }

    if (!user.ativo) {
      throw new Error("Usuario inativo");
    }

    const senhaCorreta = await compare(senha, user.senha);

    if (!senhaCorreta) {
      throw new Error("Senha incorreta");
    }

    const token = sign(
      {
        name: user.nome,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id.toString(),
        expiresIn: "30d",
      }
    );

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      ativo: user.ativo,
      tipo: user.tipo,
      nomeSocial: user.nomeSocial,
      telefone: user.telefone,
      cpf: user.cpf,
      linkFoto: user.linkFoto,
      plano:
        user.plano === "PLANO_1"
          ? "1"
          : user.plano === "PLANO_2"
            ? "2"
            : user.plano === "PLANO_3"
              ? "3"
              : null,
      validade: user.validade,
      token,
    };
  }
}

export { AuthUserService };
