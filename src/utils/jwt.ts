import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function generateToken(userId: number) {
  return jwt.sign({}, env.jwtSecret, {
    subject: String(userId),
    expiresIn: "7d",
  });
}
