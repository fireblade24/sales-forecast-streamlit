import { z } from "zod";

export const EnergyLevelSchema = z.enum(["low", "medium", "high"]);
export const TaskStatusSchema = z.enum(["inbox", "scheduled", "in_progress", "done", "missed", "snoozed"]);
export const TaskTypeSchema = z.enum(["deep_work", "admin", "errand", "call", "physical", "other"]);

export const UserPreferencesSchema = z.object({
  timezone: z.string().default("America/New_York"),
  wakeTime: z.string().default("08:00"),
  sleepTime: z.string().default("22:00"),
  peakHours: z.array(z.number().int().min(0).max(23)).default([9, 10, 11, 12]),
  quietHours: z.array(z.number().int().min(0).max(23)).default([21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7]),
  maxTasksPerDay: z.number().int().min(1).default(5),
  maxFocusMinutesPerDay: z.number().int().min(30).default(180),
  defaultDurationMinutes: z.number().int().min(5).default(15)
});

export const TaskSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  status: TaskStatusSchema.default("inbox"),
  calendarId: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  lastModifiedBy: z.enum(["user", "ai", "system"]).default("user"),
  durationMinutes: z.number().int().min(5).default(15),
  energyLevel: EnergyLevelSchema.default("medium"),
  taskType: TaskTypeSchema.default("other"),
  dueDate: z.string().optional(),
  preferredWindowStart: z.string().optional(),
  preferredWindowEnd: z.string().optional(),
  scheduledStart: z.string().optional(),
  scheduledEnd: z.string().optional(),
  missedCount: z.number().int().default(0),
  snoozedUntil: z.string().optional()
});

export const CreateTaskBodySchema = TaskSchema.pick({
  title: true,
  description: true,
  status: true,
  calendarId: true,
  durationMinutes: true,
  energyLevel: true,
  taskType: true,
  dueDate: true,
  preferredWindowStart: true,
  preferredWindowEnd: true,
  scheduledStart: true,
  scheduledEnd: true
});

export const UpdateTaskBodySchema = CreateTaskBodySchema.partial();
export const SnoozeBodySchema = z.object({ minutes: z.number().int().min(5).max(24 * 60) });
export const DateBodySchema = z.object({ date: z.string() });
export const RangeBodySchema = z.object({ startDate: z.string(), endDate: z.string() });
export const ParseTaskBodySchema = z.object({ text: z.string().min(1) });
export const DeviceRegisterSchema = z.object({ fcmToken: z.string().min(10), platform: z.string() });

export type Task = z.infer<typeof TaskSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
