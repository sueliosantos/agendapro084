import { StatusAgenda } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import { AgendaService } from "../../services/agenda/AgendaService";
import { successResponse } from "../../utils/http";

const createAgendaSchema = z.object({
  pacienteId: z.number().int().positive(),
  data: z.string(),
  hora: z.string().min(4),
  status: z.nativeEnum(StatusAgenda).optional(),
  valorConsulta: z.number().nonnegative().optional(),
});

const updateStatusSchema = z.object({
  status: z.nativeEnum(StatusAgenda),
});

type CreateAgendaBody = {
  pacienteId: number;
  data: string;
  hora: string;
  status?: StatusAgenda;
  valorConsulta?: number;
};

type UpdateStatusBody = {
  status: StatusAgenda;
};

export class AgendaController {
  private service = new AgendaService();

  create = async (req: Request, res: Response) => {
    const body = createAgendaSchema.parse(req.body) as CreateAgendaBody;
    const data = await this.service.create(req.userId!, body);

    return successResponse(res, {
      statusCode: 201,
      data,
      message: "Consulta agendada com sucesso.",
    });
  };

  dia = async (req: Request, res: Response) => {
    const data = await this.service.listDay(req.userId!, req.query.data as string | undefined);

    return successResponse(res, {
      data,
      message: "Agenda do dia carregada com sucesso.",
    });
  };

  semana = async (req: Request, res: Response) => {
    const data = await this.service.listWeek(req.userId!, req.query.data as string | undefined);

    return successResponse(res, {
      data,
      message: "Agenda da semana carregada com sucesso.",
    });
  };

  mes = async (req: Request, res: Response) => {
    const data = await this.service.listMonth(req.userId!, req.query.data as string | undefined);

    return successResponse(res, {
      data,
      message: "Agenda do mes carregada com sucesso.",
    });
  };

  updateStatus = async (req: Request, res: Response) => {
    const body = updateStatusSchema.parse(req.body) as UpdateStatusBody;
    const data = await this.service.updateStatus(req.userId!, Number(req.params.id), body.status);

    return successResponse(res, {
      data,
      message: "Status da consulta atualizado com sucesso.",
    });
  };
}
