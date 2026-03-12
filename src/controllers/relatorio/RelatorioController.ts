import { Request, Response } from "express";
import { RelatorioService } from "../../services/relatorio/RelatorioService";

export class RelatorioController {
  private service = new RelatorioService();

  mensal = async (req: Request, res: Response) => {
    const pdf = await this.service.mensal(req.userId!, req.query.data as string | undefined);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="relatorio-mensal.pdf"');

    return res.send(pdf);
  };
}
