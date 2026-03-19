import { Router } from "express";
import { analyzeController } from "../controllers/analyzeController.ts";

export const analyzeRouter = Router();

analyzeRouter.post("/", analyzeController);
