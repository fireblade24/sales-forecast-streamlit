import { Router } from "express";
import { dispatchReminders } from "../jobs/reminders.js";

export const jobsRouter = Router();

function checkCronKey(key?: string) {
  return !!process.env.CRON_SECRET && key === process.env.CRON_SECRET;
}

jobsRouter.post("/dispatchReminders", async (req, res) => {
  if (!checkCronKey(req.headers["x-cron-secret"] as string)) return res.status(403).json({ error: "forbidden" });
  const count = await dispatchReminders();
  res.json({ sent: count });
});

jobsRouter.post("/rescheduleMissed", async (req, res) => {
  if (!checkCronKey(req.headers["x-cron-secret"] as string)) return res.status(403).json({ error: "forbidden" });
  res.json({ ok: true, note: "Call /v1/plan/rescheduleMissed per user in production queue." });
});

jobsRouter.post("/autoplanToday", async (req, res) => {
  if (!checkCronKey(req.headers["x-cron-secret"] as string)) return res.status(403).json({ error: "forbidden" });
  res.json({ ok: true, note: "Call /v1/plan/autoplanDay per user in production queue." });
});
