import { describe, expect, it } from "vitest";
import { parseTaskText } from "../src/lib/parser.js";

const samples = [
  "Call mom in 10 minutes",
  "Deep work on quarterly report for 2 hours",
  "Buy groceries tomorrow",
  "Email the client in 30 min",
  "Go for a 45 minute walk",
  "Plan sprint goals",
  "Pay electricity invoice",
  "Quick tidy desk",
  "Write study notes for 1 hour",
  "Doctor checkup tomorrow",
  "Pick up package",
  "Phone bank in 20 minutes",
  "Hard coding session 90 minutes",
  "Light admin cleanup",
  "Gym session in 1 hour",
  "Meeting prep 25 minutes",
  "Review budget",
  "Call insurance",
  "Focus block for writing",
  "Shop for birthday gift"
];

describe("parseTaskText", () => {
  it("parses 20 freeform samples", async () => {
    for (const s of samples) {
      const parsed = await parseTaskText(s);
      expect(parsed.title.length).toBeGreaterThan(0);
      expect(parsed.durationMinutes).toBeGreaterThan(0);
      expect(["low", "medium", "high"]).toContain(parsed.energyLevel);
    }
  });
});
