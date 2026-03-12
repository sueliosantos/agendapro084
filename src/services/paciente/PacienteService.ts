import { TipoAtendimento } from "@prisma/client";
import { prisma } from "../../prisma";
import { AppError } from "../../utils/AppError";

type PacienteInput = {
  nome: string;
  telefone: string;
  tipoAtendimento: TipoAtendimento;
  planoSaudeId?: number;
  valorParticular?: number;
};

export class PacienteService {
  private async validarRelacionamentos(userId: number, data: PacienteInput) {
    if (data.tipoAtendimento === TipoAtendimento.PARTICULAR) {
      if (data.valorParticular === undefined) {
        throw new AppError("Informe o valor particular para atendimento particular.");
      }

      return;
    }

    if (!data.planoSaudeId) {
      throw new AppError("Informe o plano de saude para atendimento por plano.");
    }

    const plano = await prisma.planoSaude.findFirst({
      where: {
        id: data.planoSaudeId,
        usuarioId: userId,
      },
    });

    if (!plano) {
      throw new AppError("Plano de saude nao encontrado.", 404);
    }
  }

  async create(userId: number, data: PacienteInput) {
    await this.validarRelacionamentos(userId, data);

    return prisma.paciente.create({
      data: {
        usuarioId: userId,
        nome: data.nome,
        telefone: data.telefone,
        tipoAtendimento: data.tipoAtendimento,
        planoSaudeId: data.tipoAtendimento === TipoAtendimento.PLANO ? data.planoSaudeId : null,
        valorParticular:
          data.tipoAtendimento === TipoAtendimento.PARTICULAR ? data.valorParticular : null,
      },
      include: {
        planoSaude: true,
      },
    });
  }

  async list(userId: number) {
    return prisma.paciente.findMany({
      where: { usuarioId: userId },
      include: { planoSaude: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(userId: number, id: number) {
    const paciente = await prisma.paciente.findFirst({
      where: { id, usuarioId: userId },
      include: { planoSaude: true },
    });

    if (!paciente) {
      throw new AppError("Paciente nao encontrado.", 404);
    }

    return paciente;
  }

  async update(userId: number, id: number, data: PacienteInput) {
    await this.getById(userId, id);
    await this.validarRelacionamentos(userId, data);

    return prisma.paciente.update({
      where: { id },
      data: {
        nome: data.nome,
        telefone: data.telefone,
        tipoAtendimento: data.tipoAtendimento,
        planoSaudeId: data.tipoAtendimento === TipoAtendimento.PLANO ? data.planoSaudeId : null,
        valorParticular:
          data.tipoAtendimento === TipoAtendimento.PARTICULAR ? data.valorParticular : null,
      },
      include: { planoSaude: true },
    });
  }

  async delete(userId: number, id: number) {
    await this.getById(userId, id);

    await prisma.paciente.delete({
      where: { id },
    });
  }
}
