import { Router } from "express";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { isAdmin } from "./middlewares/isAdmin";
import { UserController } from "./controllers/user/UserController";

const router = Router();

router.post("/users", new UserController().handle);
router.put("/users/me", isAuthenticated, new UserController().updateMe);
router.patch("/users/:id/plano", isAuthenticated, isAdmin, new UserController().updatePlano);
router.patch("/users/me/senha", isAuthenticated, new UserController().alterarSenha);
router.get("/admin/users", isAuthenticated, isAdmin, new UserController().adminList);
router.patch("/admin/users/:id", isAuthenticated, isAdmin, new UserController().adminUpdate);
router.post("/session", new AuthUserController().handle);
router.get("/me", isAuthenticated, new DetailUserController().handle);
export { router };
