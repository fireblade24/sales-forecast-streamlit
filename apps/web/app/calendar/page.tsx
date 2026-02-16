"use client";
import { useState } from "react";
import { api } from "../../lib/api";

const slots = Array.from({ length: 12 }, (_, index) => `${8 + index}:00`);

export default function CalendarPage() {
  const [view, setView] = useState<"day" | "week">("day");

  return (
    <div>
      <section className="page-header">
        <h2>Calendar</h2>
        <p>Drag blocks to reflow your day without overloading it.</p>
      </section>

      <div className="row" style={{ marginBottom: 10 }}>
        <button className={view === "day" ? "primary" : ""} onClick={() => setView("day")}>Day</button>
        <button className={view === "week" ? "primary" : ""} onClick={() => setView("week")}>Week</button>
      </div>

      <div className="card">
        {slots.map((slot) => (
          <div
            key={slot}
            className="slot"
            draggable
            onDragEnd={() => api("/v1/plan/reflowDay", "POST", { date: new Date().toISOString().slice(0, 10) })}
          >
            <span>{slot}</span>
            <span className="muted">Drag task block</span>
          </div>
        ))}
      </div>
    </div>
  );
}
