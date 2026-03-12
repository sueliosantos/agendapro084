import { StatusAgenda, TipoAtendimento } from "@prisma/client";
import { prisma } from "../../prisma";
import { AppError } from "../../utils/AppError";
import { endOfDay, getMonthRange, getWeekRange, parseDateInput, startOfDay } from "../../utils/date";

type CreateAgendaInput = {
  pacienteId: number;
  data: string;
  hora: string;
  status?: StatusAgenda;
  valorConsulta?: number;
};

export class AgendaService {
  private async resolveValorConsulta(userId: number, pacienteId: number, valorConsulta?: number) {
    if (valorConsulta !== undefined) {
      return valorConsulta;
    }

    const paciente = await prisma.paciente.findFirst({
      where: {
        id: pacienteId,
        usuarioId: userId,
      },
      include: {
        planoSaude: true,
      },
    });

    if (!paciente) {
      throw new AppError("Paciente nao encontrado.", 404);
    }

    if (paciente.tipoAtendimento === TipoAtendimento.PARTICULAR) {
      return Number(paciente.valorParticular || 0);
    }

    if (!paciente.planoSaude) {
      throw new AppError("Paciente sem plano de saude vinculado.", 400);
    }

    return Number(paciente.planoSaude.valorLiquido || paciente.planoSaude.valorConsulta);
  }

  async create(userId: number, data: CreateAgendaInput) {
    const paciente = await prisma.paciente.findFirst({
      where: {
        id: data.pacienteId,
        usuarioId: userId,
      },
    });

    if (!paciente) {
      throw new AppError("Paciente nao encontrado.", 404);
    }

    const valorConsulta = await this.resolveValorConsulta(userId, data.pacienteId, data.valorConsulta);

    return prisma.agenda.create({
      data: {
        usuarioId: userId,
        pacienteId: data.pacienteId,
        data: new Date(`${data.data}T00:00:00`),
        hora: data.hora,
        status: data.status || StatusAgenda.AGENDADO,
        valorConsulta,
      },
      include: {
        paciente: true,
      },
    });
  }

  private async listByPeriod(userId: number, start: Date, end: Date) {
    return prisma.agenda.findMany({
      where: {
        usuarioId: userId,
        data: {
          gte: start,
          lte: end,
        },
      },
      include: {
        paciente: {
          select: {
            id: true,
            nome: true,
            telefone: true,
          },
        },
      },
      orderBy: [{ data: "asc" }, { hora: "asc" }],
    });
  }

  async listDay(userId: number, date?: string) {
    const reference = parseDateInput(date);

    if (!reference) {
      throw new AppError("Data invalida.");
    }

    return this.listByPeriod(userId, startOfDay(reference), endOfDay(reference));
  }

  async listWeek(userId: number, date?: string) {
    const reference = parseDateInput(date);

    if (!reference) {
      throw new AppError("Data invalida.");
    }

    const { start, end } = getWeekRange(reference);
    return this.listByPeriod(userId, start, end);
  }

  async listMonth(userId: number, date?: string) {
    const reference = parseDateInput(date);

    if (!reference) {
      throw new AppError("Data invalida.");
    }

    const { start, end } = getMonthRange(reference);
    return this.listByPeriod(userId, start, end);
  }

  async updateStatus(userId: number, id: number, status: StatusAgenda) {
    const agenda = await prisma.agenda.findFirst({
      where: {
        id,
        usuarioId: userId,
      },
    });

    if (!agenda) {
      throw new AppError("Consulta nao encontrada.", 404);
    }

    return prisma.agenda.update({
      where: { id },
      data: { status },
      include: {
        paciente: true,
      },
    });
  }
}
