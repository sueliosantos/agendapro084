import { TipoAtendimento } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import { PacienteService } from "../../services/paciente/PacienteService";
import { successResponse } from "../../utils/http";

const pacienteSchema = z.object({
  nome: z.string().min(3),
  telefone: z.string().min(8),
  tipoAtendimento: z.nativeEnum(TipoAtendimento),
  planoSaudeId: z.number().int().positive().optional(),
  valorParticular: z.number().nonnegative().optional(),
});

type PacienteBody = {
  nome: string;
  telefone: string;
  tipoAtendimento: TipoAtendimento;
  planoSaudeId?: number;
  valorParticular?: number;
};

export class PacienteController {
  private service = new PacienteService();

  create = async (req: Request, res: Response) => {
    const body = pacienteSchema.parse(req.body) as PacienteBody;
    const data = await this.service.create(req.userId!, body);

    return successResponse(res, {
      statusCode: 201,
      data,
      message: "Paciente criado com sucesso.",
    });
  };

  list = async (req: Request, res: Response) => {
    const data = await this.service.list(req.userId!);

    return successResponse(res, {
      data,
      message: "Pacientes listados com sucesso.",
    });
  };

  getById = async (req: Request, res: Response) => {
    const data = await this.service.getById(req.userId!, Number(req.params.id));

    return successResponse(res, {
      data,
      message: "Paciente carregado com sucesso.",
    });
  };

  update = async (req: Request, res: Response) => {
    const body = pacienteSchema.parse(req.body) as PacienteBody;
    const data = await this.service.update(req.userId!, Number(req.params.id), body);

    return successResponse(res, {
      data,
      message: "Paciente atualizado com sucesso.",
    });
  };

  delete = async (req: Request, res: Response) => {
    await this.service.delete(req.userId!, Number(req.params.id));

    return successResponse(res, {
      message: "Paciente removido com sucesso.",
    });
  };
}
