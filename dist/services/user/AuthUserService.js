"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthUserService {
    execute({ email, senha }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.default.usuario.findFirst({
                where: {
                    email: email,
                },
            });
            if (!user) {
                throw new Error("Usuário/senha incorreto");
            }
            const senhaCorreta = yield (0, bcryptjs_1.compare)(senha, user.senha);
            if (!senhaCorreta) {
                throw new Error("Senha incorreta");
            }
            //gera token
            const token = (0, jsonwebtoken_1.sign)({
                name: user.nome,
                email: user.email,
            }, process.env.JWT_SECRET, {
                subject: user.id.toString(),
                expiresIn: "30d",
            });
            return {
                id: user.id,
                nome: user.nome,
                email: user.email,
                senha: user.senha,
                ativo: user.ativo,
                token: token,
            };
        });
    }
}
exports.AuthUserService = AuthUserService;
