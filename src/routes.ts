import { Router } from "express";
import { agendaRoutes } from "./routes/agendaRoutes";
import { authRoutes } from "./routes/authRoutes";
import { financeiroRoutes } from "./routes/financeiroRoutes";
import { pacienteRoutes } from "./routes/pacienteRoutes";
import { planoSaudeRoutes } from "./routes/planoSaudeRoutes";
import { relatorioRoutes } from "./routes/relatorioRoutes";
import { usuarioRoutes } from "./routes/usuarioRoutes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/usuario", usuarioRoutes);
routes.use("/planos", planoSaudeRoutes);
routes.use("/pacientes", pacienteRoutes);
routes.use("/agenda", agendaRoutes);
routes.use("/financeiro", financeiroRoutes);
routes.use("/relatorios", relatorioRoutes);

export { routes };
