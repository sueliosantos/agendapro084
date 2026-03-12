import { Router } from "express";
import { FinanceiroController } from "../controllers/financeiro/FinanceiroController";
import { authMiddleware } from "../middleware/authMiddleware";
import { verificarAssinaturaAtiva } from "../middleware/verificarAssinaturaAtiva";

const financeiroRoutes = Router();
const controller = new FinanceiroController();

financeiroRoutes.use(authMiddleware, verificarAssinaturaAtiva);
financeiroRoutes.get("/dia", controller.dia);
financeiroRoutes.get("/semana", controller.semana);
financeiroRoutes.get("/mes", controller.mes);

export { financeiroRoutes };
