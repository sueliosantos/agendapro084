"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
function isAuthenticated(req, res, next) {
    let authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).end();
    }
    if (authToken.includes("Bearer")) {
        authToken = authToken.split(" ")[1];
    }
    try {
        //validando o token
        const { sub } = (0, jsonwebtoken_1.verify)(authToken, process.env.JWT_SECRET);
        //recupera o id do usuário e guarda dentro do request para ser usado depois
        req.user_id = sub;
        return next();
    }
    catch (error) {
        return res.status(401).end();
    }
}
exports.isAuthenticated = isAuthenticated;
