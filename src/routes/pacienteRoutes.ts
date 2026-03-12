import { Router } from "express";
import { PacienteController } from "../controllers/paciente/PacienteController";
import { authMiddleware } from "../middleware/authMiddleware";
import { verificarAssinaturaAtiva } from "../middleware/verificarAssinaturaAtiva";

const pacienteRoutes = Router();
const controller = new PacienteController();

pacienteRoutes.use(authMiddleware, verificarAssinaturaAtiva);
pacienteRoutes.post("/", controller.create);
pacienteRoutes.get("/", controller.list);
pacienteRoutes.get("/:id", controller.getById);
pacienteRoutes.put("/:id", controller.update);
pacienteRoutes.delete("/:id", controller.delete);

export { pacienteRoutes };
