import { StatusAgenda } from "@prisma/client";
import { prisma } from "../../prisma";
import { AppError } from "../../utils/AppError";
import { endOfDay, getMonthRange, getWeekRange, parseDateInput, startOfDay } from "../../utils/date";

export class FinanceiroService {
  private async buildResumo(userId: number, start: Date, end: Date) {
    const consultas = await prisma.agenda.findMany({
      where: {
        usuarioId: userId,
        data: {
          gte: start,
          lte: end,
        },
      },
      select: {
        status: true,
        valorConsulta: true,
      },
    });

    const totalConsultas = consultas.length;
    const totalCompareceu = consultas.filter((item) => item.status === StatusAgenda.COMPARECEU).length;
    const totalFaltou = consultas.filter((item) => item.status === StatusAgenda.FALTOU).length;
    const valorTotalFaturado = consultas
      .filter((item) => item.status === StatusAgenda.COMPARECEU)
      .reduce((acc, item) => acc + Number(item.valorConsulta), 0);

    return {
      total_consultas: totalConsultas,
      total_compareceu: totalCompareceu,
      total_faltou: totalFaltou,
      valor_total_faturado: valorTotalFaturado,
    };
  }

  async dia(userId: number, date?: string) {
    const reference = parseDateInput(date);

    if (!reference) {
      throw new AppError("Data invalida.");
    }

    return this.buildResumo(userId, startOfDay(reference), endOfDay(reference));
  }

  async semana(userId: number, date?: string) {
    const reference = parseDateInput(date);

    if (!reference) {
      throw new AppError("Data invalida.");
    }

    const { start, end } = getWeekRange(reference);
    return this.buildResumo(userId, start, end);
  }

  async mes(userId: number, date?: string) {
    const reference = parseDateInput(date);

    if (!reference) {
      throw new AppError("Data invalida.");
    }

    const { start, end } = getMonthRange(reference);
    return this.buildResumo(userId, start, end);
  }
}
