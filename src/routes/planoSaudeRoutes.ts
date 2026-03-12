import { Router } from "express";
import { PlanoSaudeController } from "../controllers/planoSaude/PlanoSaudeController";
import { authMiddleware } from "../middleware/authMiddleware";
import { verificarAssinaturaAtiva } from "../middleware/verificarAssinaturaAtiva";

const planoSaudeRoutes = Router();
const controller = new PlanoSaudeController();

planoSaudeRoutes.use(authMiddleware, verificarAssinaturaAtiva);
planoSaudeRoutes.post("/", controller.create);
planoSaudeRoutes.get("/", controller.list);
planoSaudeRoutes.get("/:id", controller.getById);
planoSaudeRoutes.put("/:id", controller.update);
planoSaudeRoutes.delete("/:id", controller.delete);

export { planoSaudeRoutes };
