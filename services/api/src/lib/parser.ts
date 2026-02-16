import { addDays } from "date-fns";

export interface ParsedTask {
  title: string;
  durationMinutes: number;
  calendar: string;
  dueDate?: string;
  preferredWindowStart?: string;
  preferredWindowEnd?: string;
  energyLevel: "low" | "medium" | "high";
  taskType: "deep_work" | "admin" | "errand" | "call" | "physical" | "other";
}

export interface AIProvider {
  parseTask(text: string): Promise<ParsedTask | null>;
}

export class StubProvider implements AIProvider {
  async parseTask(): Promise<ParsedTask | null> {
    return null;
  }
}

export async function parseTaskText(text: string, provider: AIProvider = new StubProvider()): Promise<ParsedTask> {
  const maybe = await provider.parseTask(text);
  if (maybe) return maybe;

  const lower = text.toLowerCase();
  const durationMatch = lower.match(/(\d+)\s?(min|mins|minutes|hour|hours|hr)/);
  const durationMinutes = durationMatch
    ? durationMatch[2].startsWith("h") ? Number(durationMatch[1]) * 60 : Number(durationMatch[1])
    : 15;
  const energyLevel = /hard|focus|deep/.test(lower) ? "high" : /easy|quick|light/.test(lower) ? "low" : "medium";
  const taskType = /call|phone/.test(lower)
    ? "call"
    : /email|invoice|admin/.test(lower)
    ? "admin"
    : /gym|walk|run/.test(lower)
    ? "physical"
    : /shop|buy|pickup/.test(lower)
    ? "errand"
    : /deep|plan|write|study/.test(lower)
    ? "deep_work"
    : "other";
  const dueDate = /tomorrow/.test(lower) ? addDays(new Date(), 1).toISOString().slice(0, 10) : undefined;
  const calendar = /work|client|meeting/.test(lower) ? "Work" : /health|doctor|gym/.test(lower) ? "Health" : "Home";
  const cleaned = text.replace(/in \d+\s?(min|mins|minutes|hour|hours|hr)/i, "").trim();

  return {
    title: cleaned.charAt(0).toUpperCase() + cleaned.slice(1),
    durationMinutes,
    calendar,
    dueDate,
    energyLevel,
    taskType
  };
}
