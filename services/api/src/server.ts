import "dotenv/config";
import express from "express";
import cors from "cors";
import { requireAuth } from "./middleware/auth.js";
import { tasksRouter } from "./routes/tasks.js";
import { planRouter } from "./routes/plan.js";
import { aiRouter } from "./routes/ai.js";
import { devicesRouter } from "./routes/devices.js";
import { jobsRouter } from "./routes/jobs.js";
import { errorHandler } from "./lib/errors.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/v1/jobs", jobsRouter);
app.use("/v1/tasks", requireAuth, tasksRouter);
app.use("/v1/plan", requireAuth, planRouter);
app.use("/v1/ai", requireAuth, aiRouter);
app.use("/v1/devices", requireAuth, devicesRouter);
app.use(errorHandler);

const port = Number(process.env.PORT || 8080);
app.listen(port, () => console.log(`API listening on ${port}`));
