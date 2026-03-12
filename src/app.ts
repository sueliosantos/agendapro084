import "dotenv/config";
import "express-async-errors";
import cors from "cors";
import express from "express";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { routes } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  return res.json({
    success: true,
    data: { status: "ok" },
    message: "API online",
  });
});

app.use(routes);
app.use(errorMiddleware);

export { app };
