import { Router } from "express";
import { DeviceRegisterSchema } from "@flowtasks/shared";
import { validate } from "../middleware/validate.js";
import { db } from "../lib/firebase.js";
import type { AuthedRequest } from "../middleware/auth.js";

export const devicesRouter = Router();

devicesRouter.post("/register", validate(DeviceRegisterSchema), async (req: AuthedRequest, res) => {
  const ref = db.collection("devices").doc();
  await ref.set({ ...req.body, userId: req.userId, updatedAt: new Date().toISOString() });
  res.json({ id: ref.id });
});
