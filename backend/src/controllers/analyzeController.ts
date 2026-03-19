import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { cleanPostText } from "../utils/cleanPostText.ts";
import { analyzeText } from "../services/analyzeService.ts";

const AnalyzeBody = z.object({
  text: z.string().min(1),
});

export async function analyzeController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = AnalyzeBody.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid body. Expected { text: string }" });
    }

    const text = cleanPostText(parsed.data.text);
    if (!text)
      return res.status(400).json({ error: "Text is empty after cleaning." });

    const analysis = await analyzeText(text);
    console.log("Analysis result:", analysis);
    return res.json(analysis);
  } catch (err) {
    return next(err);
  }
}
