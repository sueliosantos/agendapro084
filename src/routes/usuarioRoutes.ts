import { Router } from "express";
import { UsuarioController } from "../controllers/usuario/UsuarioController";
import { authMiddleware } from "../middleware/authMiddleware";
import { verificarAssinaturaAtiva } from "../middleware/verificarAssinaturaAtiva";

const usuarioRoutes = Router();
const controller = new UsuarioController();

usuarioRoutes.use(authMiddleware, verificarAssinaturaAtiva);
usuarioRoutes.get("/me", controller.me);
usuarioRoutes.put("/update", controller.update);
usuarioRoutes.put("/change-password", controller.changePassword);

export { usuarioRoutes };
