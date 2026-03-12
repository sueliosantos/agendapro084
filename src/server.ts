import { app } from "./app";
import { env } from "./config/env";

app.listen(env.port, () => {
  console.log(`Servidor online na porta ${env.port}`);
});
