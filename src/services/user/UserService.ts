import { PlanoUsuario, Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import prismaClient from "../../prisma";

interface UserRequest {
  nome?: string;
  email: string;
  senha: string;
  ativo?: boolean;
  nomeSocial?: string;
  telefone?: string;
  tipo?: string;
  cpf?: string;
  plano?: string;
  validade?: Date | null;
  linkFoto?: string;
}

interface UserEditRequest extends Partial<UserRequest> {
  id: number;
}

type AdminUserListItem = {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  tipo: string;
  nomeSocial: string | null;
  telefone: string | null;
  cpf: string | null;
  plano: string | null;
  validade: Date | null;
  linkFoto: string | null;
  createdAt: Date;
  updatedAt: Date;
};

class UserService {
  private normalizarTextoOpcional(valor?: string | null) {
    if (valor === undefined) return undefined;
    if (valor === null) return null;

    const texto = valor.trim();
    return texto === "" ? null : texto;
  }

  private parsePlano(
    plano?: string | null
  ): PlanoUsuario | null | undefined {
    if (plano === undefined) return undefined;
    if (plano === null) return null;

    const valor = plano.trim().toUpperCase();

    if (!valor || valor === "SEM_PLANO" || valor === "NONE" || valor === "NULL") {
      return null;
    }

    if (valor === "1" || valor === "PLANO_1") return "PLANO_1";
    if (valor === "2" || valor === "PLANO_2") return "PLANO_2";
    if (valor === "3" || valor === "PLANO_3") return "PLANO_3";

    throw new Error("Plano invalido. Use: 1, 2 ou 3");
  }

  private planoToCodigo(plano: string | null) {
    if (!plano) return null;
    if (plano === "PLANO_1") return "1";
    if (plano === "PLANO_2") return "2";
    return "3";
  }

  async execute({
    nome,
    email,
    senha,
    ativo = true,
    nomeSocial,
    telefone,
    tipo,
    cpf,
    plano,
    validade,
    linkFoto,
  }: UserRequest) {
    if (!email) {
      throw new Error("Email invalido");
    }

    if (!senha) {
      throw new Error("Senha invalida");
    }

    const emailNormalizado = email.trim().toLowerCase();
    const cpfNormalizado = this.normalizarTextoOpcional(cpf);

    const emailJaExiste = await prismaClient.usuario.findUnique({
      where: {
        email: emailNormalizado,
      },
    });

    if (emailJaExiste) {
      throw new Error("Usuario ja cadastrado");
    }

    if (cpfNormalizado) {
      const cpfJaExiste = await prismaClient.usuario.findFirst({
        where: {
          cpf: cpfNormalizado,
        },
        select: {
          id: true,
        },
      });

      if (cpfJaExiste) {
        throw new Error("CPF ja cadastrado");
      }
    }

    const user = await prismaClient.usuario.create({
      data: {
        nome: nome?.trim() || emailNormalizado,
        email: emailNormalizado,
        senha: await hash(senha, 8),
        ativo,
        nomeSocial: this.normalizarTextoOpcional(nomeSocial),
        telefone: this.normalizarTextoOpcional(telefone),
        cpf: cpfNormalizado,
        tipo: tipo?.trim() || "USER",
        plano: this.parsePlano(plano) ?? undefined,
        validade: validade ?? undefined,
        linkFoto: this.normalizarTextoOpcional(linkFoto) ?? undefined,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        ativo: true,
        nomeSocial: true,
        telefone: true,
        cpf: true,
        tipo: true,
        plano: true,
        validade: true,
        linkFoto: true,
        createdAt: true,
      },
    });

    return {
      ...user,
      plano: this.planoToCodigo(user.plano),
    };
  }

  async editar({
    id,
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
  }: UserEditRequest) {
    const data: Prisma.UsuarioUpdateInput = {};
    const emailNormalizado = email !== undefined ? email.trim().toLowerCase() : undefined;
    const cpfNormalizado = this.normalizarTextoOpcional(cpf);

    if (emailNormalizado !== undefined) {
      const emailJaExiste = await prismaClient.usuario.findFirst({
        where: {
          email: emailNormalizado,
          id: {
            not: id,
          },
        },
        select: {
          id: true,
        },
      });

      if (emailJaExiste) {
        throw new Error("Email ja cadastrado");
      }
    }

    if (cpfNormalizado) {
      const cpfJaExiste = await prismaClient.usuario.findFirst({
        where: {
          cpf: cpfNormalizado,
          id: {
            not: id,
          },
        },
        select: {
          id: true,
        },
      });

      if (cpfJaExiste) {
        throw new Error("CPF ja cadastrado");
      }
    }

    if (nome !== undefined) data.nome = nome.trim();
    if (emailNormalizado !== undefined) data.email = emailNormalizado;
    if (ativo !== undefined) data.ativo = ativo;
    if (nomeSocial !== undefined) data.nomeSocial = this.normalizarTextoOpcional(nomeSocial);
    if (telefone !== undefined) data.telefone = this.normalizarTextoOpcional(telefone);
    if (cpfNormalizado !== undefined) data.cpf = cpfNormalizado;
    if (tipo !== undefined) data.tipo = tipo.trim();
    if (plano !== undefined) data.plano = this.parsePlano(plano);
    if (validade !== undefined) data.validade = validade;
    if (linkFoto !== undefined) data.linkFoto = this.normalizarTextoOpcional(linkFoto);

    if (senha) {
      data.senha = await hash(senha, 8);
    }

    const user = await prismaClient.usuario.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        ativo: true,
        nomeSocial: true,
        telefone: true,
        cpf: true,
        tipo: true,
        plano: true,
        validade: true,
        linkFoto: true,
        updatedAt: true,
      },
    });

    return {
      ...user,
      plano: this.planoToCodigo(user.plano),
    };
  }

  async atualizarPlano(id: number, plano: string, validade: Date | null) {
    if (validade !== null && (!(validade instanceof Date) || Number.isNaN(validade.getTime()))) {
      throw new Error("Validade invalida");
    }

    const user = await prismaClient.usuario.update({
      where: {
        id,
      },
      data: {
        plano: this.parsePlano(plano),
        validade,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        ativo: true,
        plano: true,
        validade: true,
      },
    });

    return {
      ...user,
      plano: this.planoToCodigo(user.plano),
    };
  }

  async alterarSenha(id: number, senha: string) {
    if (!senha) {
      throw new Error("Senha invalida");
    }

    return prismaClient.usuario.update({
      where: {
        id,
      },
      data: {
        senha: await hash(senha, 8),
        token: null,
      },
      select: {
        id: true,
        email: true,
        updatedAt: true,
      },
    });
  }

  async listarTodosAdmin(): Promise<AdminUserListItem[]> {
    const users = await prismaClient.usuario.findMany({
      orderBy: [{ ativo: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        nome: true,
        email: true,
        ativo: true,
        tipo: true,
        nomeSocial: true,
        telefone: true,
        cpf: true,
        plano: true,
        validade: true,
        linkFoto: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users.map((user) => ({
      ...user,
      plano: this.planoToCodigo(user.plano),
    }));
  }
}

export { UserService };
