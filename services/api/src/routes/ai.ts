import { Router } from "express";
import { ParseTaskBodySchema } from "@flowtasks/shared";
import { validate } from "../middleware/validate.js";
import { parseTaskText } from "../lib/parser.js";

export const aiRouter = Router();

aiRouter.post("/parseTask", validate(ParseTaskBodySchema), async (req, res) => {
  const parsed = await parseTaskText(req.body.text);
  res.json(parsed);
});
