import { Router } from "express";
import { DateBodySchema, RangeBodySchema } from "@flowtasks/shared";
import { autoplanDay, reflowDay, rescheduleMissedTasks } from "@flowtasks/scheduler";
import { db } from "../lib/firebase.js";
import { validate } from "../middleware/validate.js";
import type { AuthedRequest } from "../middleware/auth.js";

export const planRouter = Router();

async function loadContext(userId: string) {
  const [tasksSnap, userSnap, eventsSnap] = await Promise.all([
    db.collection("tasks").where("userId", "==", userId).get(),
    db.collection("users").doc(userId).get(),
    db.collection("events").where("userId", "==", userId).get()
  ]);

  return {
    tasks: tasksSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as any,
    preferences: userSnap.data()?.preferences,
    existingEvents: eventsSnap.docs.map((d) => d.data()) as any
  };
}

planRouter.post("/autoplanDay", validate(DateBodySchema), async (req: AuthedRequest, res) => {
  const context = await loadContext(req.userId!);
  const scheduled = autoplanDay(req.userId!, req.body.date, context as any);
  const batch = db.batch();
  scheduled.forEach((task) => batch.update(db.collection("tasks").doc(task.id), task));
  await batch.commit();
  res.json({ count: scheduled.length });
});

planRouter.post("/reflowDay", validate(DateBodySchema), async (req: AuthedRequest, res) => {
  const context = await loadContext(req.userId!);
  const scheduled = reflowDay(req.userId!, req.body.date, context as any);
  const batch = db.batch();
  scheduled.forEach((task) => batch.update(db.collection("tasks").doc(task.id), task));
  await batch.commit();
  res.json({ count: scheduled.length });
});

planRouter.post("/rescheduleMissed", validate(RangeBodySchema), async (req: AuthedRequest, res) => {
  const context = await loadContext(req.userId!);
  const scheduled = rescheduleMissedTasks(req.userId!, req.body, context as any);
  const batch = db.batch();
  scheduled.forEach((task) => batch.update(db.collection("tasks").doc(task.id), task));
  await batch.commit();
  res.json({ count: scheduled.length });
});
