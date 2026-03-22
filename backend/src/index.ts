import "dotenv/config";
import express from "express";
import cors from "cors";
import { analyzeRouter } from "./routes/analyze.ts";
import { errorHandler, notFound } from "./utils/index.ts";

const app = express();

// Set this early so CORS preflight handled by `cors()` still includes it.
app.use((req, res, next) => {
  if (req.headers["access-control-request-private-network"] === "true") {
    res.setHeader("Access-Control-Allow-Private-Network", "true");
  }
  next();
});

app.use(
  cors({
    origin: true,
    credentials: false,
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options("*", (req, res) => {
  if (req.headers["access-control-request-private-network"] === "true") {
    res.setHeader("Access-Control-Allow-Private-Network", "true");
  }
  res.sendStatus(204);
});

app.use(express.json());

app.use("/analyze", analyzeRouter);

app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT ?? 3001);
const server = app.listen(port, () => {
  console.log(`[ ANINAG BACKEND ] Listening on port:${port}`);
});

// Help `tsx watch` restart cleanly without EADDRINUSE.
function shutdown(signal: string) {
  console.log(`[ SYSTEM ] ${signal} received, closing server...`);
  server.close(() => {
    console.log("[ SYSTEM ] Server Closed.");
    process.exit(0);
  });

  // Force-exit if close hangs.
  setTimeout(() => process.exit(0), 1500).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
