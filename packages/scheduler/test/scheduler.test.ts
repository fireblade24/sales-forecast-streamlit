import { describe, expect, it } from "vitest";
import { autoplanTasks } from "../src/index.js";

const prefs = {
  timezone: "America/New_York",
  wakeTime: "08:00",
  sleepTime: "20:00",
  peakHours: [9, 10, 11],
  quietHours: [21, 22],
  maxTasksPerDay: 5,
  maxFocusMinutesPerDay: 180,
  defaultDurationMinutes: 15
};

describe("autoplanTasks", () => {
  it("schedules within focus cap and inserts quick wins", () => {
    const tasks = Array.from({ length: 7 }).map((_, i) => ({
      id: `t${i}`,
      userId: "u1",
      title: `Task ${i}`,
      status: "inbox" as const,
      calendarId: "c1",
      durationMinutes: 30,
      energyLevel: i % 2 ? "high" as const : "medium" as const,
      taskType: "other" as const,
      lastModifiedBy: "user" as const,
      missedCount: 0
    }));

    const result = autoplanTasks({ date: "2026-01-01", tasks, existingEvents: [], preferences: prefs });
    expect(result.length).toBeGreaterThan(1);
    expect(result[0].title).toBe("Quick Wins Sprint");
    const total = result.reduce((sum, t) => sum + t.durationMinutes, 0);
    expect(total).toBeLessThanOrEqual(180);
  });
});
