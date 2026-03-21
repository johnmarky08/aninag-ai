import { Router } from "express";
import { analyzeTextController } from "../controllers/analyzeTextController.ts";

export const analyzeRouter = Router();

analyzeRouter.post("/", analyzeTextController);
