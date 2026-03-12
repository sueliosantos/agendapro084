import { prisma } from "../../prisma";
import { AppError } from "../../utils/AppError";

type PlanoInput = {
  nome: string;
  valorConsulta: number;
  dataPagamento: Date;
  percentualDesconto?: number;
  valorLiquido?: number;
};

export class PlanoSaudeService {
  async create(userId: number, data: PlanoInput) {
    return prisma.planoSaude.create({
      data: {
        usuarioId: userId,
        nome: data.nome,
        valorConsulta: data.valorConsulta,
        dataPagamento: data.dataPagamento,
        percentualDesconto: data.percentualDesconto,
        valorLiquido: data.valorLiquido,
      },
    });
  }

  async list(userId: number) {
    return prisma.planoSaude.findMany({
      where: { usuarioId: userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(userId: number, id: number) {
    const plano = await prisma.planoSaude.findFirst({
      where: { id, usuarioId: userId },
    });

    if (!plano) {
      throw new AppError("Plano de saude nao encontrado.", 404);
    }

    return plano;
  }

  async update(userId: number, id: number, data: Partial<PlanoInput>) {
    await this.getById(userId, id);

    return prisma.planoSaude.update({
      where: { id },
      data,
    });
  }

  async delete(userId: number, id: number) {
    await this.getById(userId, id);

    await prisma.planoSaude.delete({
      where: { id },
    });
  }
}
