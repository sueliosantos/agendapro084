import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface AuthRequest {
  email: string;
  senha: string;
}

class AuthUserService {
  async execute({ email, senha }: AuthRequest) {
    const user = await prismaClient.usuario.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("Usuário/senha incorreto");
    }

    const senhaCorreta = await compare(senha, user.senha);

    if (!senhaCorreta) {
      throw new Error("Senha incorreta");
    }

    //gera token

    const token = sign(
      {
        name: user.nome,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        subject: user.id.toString(),
        expiresIn: "30d",
      }
    );
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      senha: user.senha,
      ativo: user.ativo,
      token: token,
    };
  }
}

export { AuthUserService };
