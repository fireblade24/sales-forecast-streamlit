"use client";
import { useState } from "react";
import { api } from "../../lib/api";

const slots = Array.from({ length: 12 }, (_, i) => `${8 + i}:00`);

export default function CalendarPage() {
  const [view, setView] = useState<"day" | "week">("day");
  return (
    <div>
      <h2>Calendar</h2>
      <div className="row">
        <button className={view === "day" ? "primary" : ""} onClick={() => setView("day")}>Day</button>
        <button className={view === "week" ? "primary" : ""} onClick={() => setView("week")}>Week</button>
      </div>
      <div className="card">
        {slots.map((s) => (
          <div key={s} draggable onDragEnd={() => api("/v1/plan/reflowDay", "POST", { date: new Date().toISOString().slice(0, 10) })} style={{ borderBottom: "1px solid #eee", padding: 8 }}>
            {s} - drag task block
          </div>
        ))}
      </div>
    </div>
  );
}
