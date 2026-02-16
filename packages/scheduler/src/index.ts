import { addMinutes, formatISO, isBefore, parseISO, set } from "date-fns";
import type { Task, UserPreferences } from "@flowtasks/shared";

export type ScheduledTask = Task & { scheduledStart: string; scheduledEnd: string; note?: string };

export interface DayPlanInput {
  date: string;
  tasks: Task[];
  existingEvents: Array<{ startTime: string; endTime: string }>;
  preferences: UserPreferences;
  bufferMinutes?: number;
}

const energyRank = { low: 0, medium: 1, high: 2 } as const;

function startOfUserDay(date: string, wakeTime: string): Date {
  const [h, m] = wakeTime.split(":").map(Number);
  return set(parseISO(`${date}T00:00:00`), { hours: h, minutes: m, seconds: 0, milliseconds: 0 });
}

function endOfUserDay(date: string, sleepTime: string): Date {
  const [h, m] = sleepTime.split(":").map(Number);
  return set(parseISO(`${date}T00:00:00`), { hours: h, minutes: m, seconds: 0, milliseconds: 0 });
}

function overlaps(start: Date, end: Date, events: Array<{ startTime: string; endTime: string }>): boolean {
  return events.some((evt) => start < parseISO(evt.endTime) && end > parseISO(evt.startTime));
}

export function autoplanTasks(input: DayPlanInput): ScheduledTask[] {
  const bufferMinutes = input.bufferMinutes ?? 5;
  const dayStart = startOfUserDay(input.date, input.preferences.wakeTime);
  const dayEnd = endOfUserDay(input.date, input.preferences.sleepTime);

  const candidates = [...input.tasks]
    .filter((t) => t.status !== "done")
    .sort((a: Task, b: Task) => energyRank[b.energyLevel] - energyRank[a.energyLevel] || a.durationMinutes - b.durationMinutes)
    .slice(0, input.preferences.maxTasksPerDay);

  const output: ScheduledTask[] = [];
  let cursor = dayStart;
  let totalFocus = 0;

  if (input.tasks.length > input.preferences.maxTasksPerDay) {
    const quickWinEnd = addMinutes(cursor, 15);
    output.push({
      ...input.tasks[0],
      title: "Quick Wins Sprint",
      durationMinutes: 15,
      scheduledStart: formatISO(cursor),
      scheduledEnd: formatISO(quickWinEnd),
      note: "Short momentum block for backlog"
    });
    cursor = addMinutes(quickWinEnd, bufferMinutes);
    totalFocus += 15;
  }

  for (const task of candidates) {
    if (totalFocus + task.durationMinutes > input.preferences.maxFocusMinutesPerDay) break;

    const duration = task.durationMinutes;
    let start = cursor;
    let end = addMinutes(start, duration);

    while (isBefore(end, dayEnd) && overlaps(start, end, input.existingEvents)) {
      start = addMinutes(start, 15);
      end = addMinutes(start, duration);
    }

    const previous = output[output.length - 1];
    if (previous && previous.energyLevel === "high" && task.energyLevel === "high") {
      start = addMinutes(parseISO(previous.scheduledEnd), 20);
      end = addMinutes(start, duration);
    }

    if (!isBefore(end, dayEnd)) continue;

    output.push({ ...task, status: "scheduled", scheduledStart: formatISO(start), scheduledEnd: formatISO(end) });
    totalFocus += duration;
    cursor = addMinutes(end, bufferMinutes);
  }

  return output;
}

export function autoplanDay(userId: string, date: string, data: Omit<DayPlanInput, "date">): ScheduledTask[] {
  return autoplanTasks({ ...data, date, tasks: data.tasks.filter((t) => t.userId === userId) });
}

export function reflowDay(userId: string, date: string, data: Omit<DayPlanInput, "date">): ScheduledTask[] {
  return autoplanDay(userId, date, data);
}

export function rescheduleMissedTasks(
  userId: string,
  _dateRange: { startDate: string; endDate: string },
  data: Omit<DayPlanInput, "date">
): ScheduledTask[] {
  const missed = data.tasks.filter((t) => t.userId === userId && t.status === "missed").map((t) => ({ ...t, missedCount: (t.missedCount ?? 0) + 1 }));
  return autoplanTasks({ ...data, date: new Date().toISOString().slice(0, 10), tasks: missed }).map((t) => ({ ...t, note: "Moved forward with kindness." }));
}

export function scheduleTask(taskId: string, data: Omit<DayPlanInput, "date"> & { date: string }): ScheduledTask | undefined {
  return autoplanTasks(data).find((t) => t.id === taskId);
}
