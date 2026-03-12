import { Request, Response } from "express";
import { FinanceiroService } from "../../services/financeiro/FinanceiroService";
import { successResponse } from "../../utils/http";

export class FinanceiroController {
  private service = new FinanceiroService();

  dia = async (req: Request, res: Response) => {
    const data = await this.service.dia(req.userId!, req.query.data as string | undefined);

    return successResponse(res, {
      data,
      message: "Resumo financeiro do dia carregado com sucesso.",
    });
  };

  semana = async (req: Request, res: Response) => {
    const data = await this.service.semana(req.userId!, req.query.data as string | undefined);

    return successResponse(res, {
      data,
      message: "Resumo financeiro da semana carregado com sucesso.",
    });
  };

  mes = async (req: Request, res: Response) => {
    const data = await this.service.mes(req.userId!, req.query.data as string | undefined);

    return successResponse(res, {
      data,
      message: "Resumo financeiro do mes carregado com sucesso.",
    });
  };
}
