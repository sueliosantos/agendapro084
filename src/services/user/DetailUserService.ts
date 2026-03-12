import prismaClient from "../../prisma";

class DetailUserService {
  async execute(user_id: number) {
    const user = await prismaClient.usuario.findFirst({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        nome: true,
        email: true,
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
      return null;
    }

    return {
      ...user,
      plano:
        user.plano === "PLANO_1"
          ? "1"
          : user.plano === "PLANO_2"
            ? "2"
            : user.plano === "PLANO_3"
              ? "3"
              : null,
    };
  }
}

export { DetailUserService };
