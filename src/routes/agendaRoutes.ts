import { Router } from "express";
import { AgendaController } from "../controllers/agenda/AgendaController";
import { authMiddleware } from "../middleware/authMiddleware";
import { verificarAssinaturaAtiva } from "../middleware/verificarAssinaturaAtiva";

const agendaRoutes = Router();
const controller = new AgendaController();

agendaRoutes.use(authMiddleware, verificarAssinaturaAtiva);
agendaRoutes.post("/", controller.create);
agendaRoutes.get("/dia", controller.dia);
agendaRoutes.get("/semana", controller.semana);
agendaRoutes.get("/mes", controller.mes);
agendaRoutes.put("/:id/status", controller.updateStatus);

export { agendaRoutes };
