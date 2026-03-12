import { Router } from "express";
import { RelatorioController } from "../controllers/relatorio/RelatorioController";
import { authMiddleware } from "../middleware/authMiddleware";
import { verificarAssinaturaAtiva } from "../middleware/verificarAssinaturaAtiva";

const relatorioRoutes = Router();
const controller = new RelatorioController();

relatorioRoutes.use(authMiddleware, verificarAssinaturaAtiva);
relatorioRoutes.get("/mensal", controller.mensal);

export { relatorioRoutes };
