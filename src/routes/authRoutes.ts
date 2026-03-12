import { Router } from "express";
import { AuthController } from "../controllers/auth/AuthController";

const authRoutes = Router();
const controller = new AuthController();

authRoutes.post("/register", controller.register);
authRoutes.post("/login", controller.login);
authRoutes.post("/forgot-password", controller.forgotPassword);
authRoutes.post("/reset-password", controller.resetPassword);

export { authRoutes };
