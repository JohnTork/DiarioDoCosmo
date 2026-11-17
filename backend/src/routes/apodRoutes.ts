import { Router } from "express";
import { getApodController } from "../controllers/apodController.js";

const apodRoutes = Router();

apodRoutes.get("/apod", getApodController);

export default apodRoutes;
