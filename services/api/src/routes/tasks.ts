import { Router } from "express";
import { addMinutes } from "date-fns";
import { CreateTaskBodySchema, SnoozeBodySchema, UpdateTaskBodySchema } from "@flowtasks/shared";
import { db } from "../lib/firebase.js";
import { validate } from "../middleware/validate.js";
import type { AuthedRequest } from "../middleware/auth.js";

export const tasksRouter = Router();

tasksRouter.post("/", validate(CreateTaskBodySchema), async (req: AuthedRequest, res) => {
  const ref = db.collection("tasks").doc();
  const now = new Date().toISOString();
  await ref.set({ ...req.body, userId: req.userId, createdAt: now, updatedAt: now, missedCount: 0 });
  res.json({ id: ref.id });
});

tasksRouter.patch("/:id", validate(UpdateTaskBodySchema), async (req: AuthedRequest, res) => {
  const ref = db.collection("tasks").doc(req.params.id);
  await ref.update({ ...req.body, updatedAt: new Date().toISOString() });
  res.json({ ok: true });
});

tasksRouter.post("/:id/complete", async (req: AuthedRequest, res) => {
  await db.collection("tasks").doc(req.params.id).update({ status: "done", updatedAt: new Date().toISOString(), lastModifiedBy: "user" });
  res.json({ ok: true });
});

tasksRouter.post("/:id/snooze", validate(SnoozeBodySchema), async (req: AuthedRequest, res) => {
  const snoozedUntil = addMinutes(new Date(), req.body.minutes).toISOString();
  await db.collection("tasks").doc(req.params.id).update({ status: "snoozed", snoozedUntil, updatedAt: new Date().toISOString() });
  res.json({ ok: true, snoozedUntil });
});
