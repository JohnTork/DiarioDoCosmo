import express from "express";
import apodRoutes from "./routes/apodRoutes.js";

const app = express();

app.use("/api", apodRoutes);

export default app;
