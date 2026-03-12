import { Request, Response } from "express";
import { z } from "zod";
import { PlanoSaudeService } from "../../services/planoSaude/PlanoSaudeService";
import { successResponse } from "../../utils/http";

const planoSchema = z.object({
  nome: z.string().min(2),
  valorConsulta: z.number().nonnegative(),
  dataPagamento: z.string(),
  percentualDesconto: z.number().nonnegative().optional(),
  valorLiquido: z.number().nonnegative().optional(),
});

const planoUpdateSchema = planoSchema.partial();

type PlanoBody = {
  nome: string;
  valorConsulta: number;
  dataPagamento: string;
  percentualDesconto?: number;
  valorLiquido?: number;
};

type PlanoUpdateBody = Partial<PlanoBody>;

export class PlanoSaudeController {
  private service = new PlanoSaudeService();

  create = async (req: Request, res: Response) => {
    const body = planoSchema.parse(req.body) as PlanoBody;
    const data = await this.service.create(req.userId!, {
      ...body,
      dataPagamento: new Date(`${body.dataPagamento}T00:00:00`),
    });

    return successResponse(res, {
      statusCode: 201,
      data,
      message: "Plano de saude criado com sucesso.",
    });
  };

  list = async (req: Request, res: Response) => {
    const data = await this.service.list(req.userId!);

    return successResponse(res, {
      data,
      message: "Planos listados com sucesso.",
    });
  };

  getById = async (req: Request, res: Response) => {
    const data = await this.service.getById(req.userId!, Number(req.params.id));

    return successResponse(res, {
      data,
      message: "Plano carregado com sucesso.",
    });
  };

  update = async (req: Request, res: Response) => {
    const body = planoUpdateSchema.parse(req.body) as PlanoUpdateBody;
    const data = await this.service.update(req.userId!, Number(req.params.id), {
      ...body,
      dataPagamento: body.dataPagamento ? new Date(`${body.dataPagamento}T00:00:00`) : undefined,
    });

    return successResponse(res, {
      data,
      message: "Plano atualizado com sucesso.",
    });
  };

  delete = async (req: Request, res: Response) => {
    await this.service.delete(req.userId!, Number(req.params.id));

    return successResponse(res, {
      message: "Plano removido com sucesso.",
    });
  };
}
