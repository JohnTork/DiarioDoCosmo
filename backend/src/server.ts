import app from "./app.js";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: fileURLToPath(new URL("../../.env", import.meta.url)),
});

const port = Number(process.env.PORT) || 3001;

app.listen(port, () => {
  console.log(`Backend iniciado na porta ${port}.`);
});
