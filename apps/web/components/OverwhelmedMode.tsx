"use client";
import { useState } from "react";

export function OverwhelmedMode() {
  const [seconds, setSeconds] = useState(300);

  return (
    <div className="card">
      <p className="kicker">I’m Overwhelmed</p>
      <h3 className="task-title">One tiny step: clear 10 emails</h3>
      <p className="muted">Keep it small (5–10 min). Just get moving.</p>
      <p><strong>5-min timer:</strong> {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</p>
      <button
        className="primary"
        onClick={() => {
          const timer = setInterval(() => {
            setSeconds((value) => {
              if (value <= 1) {
                clearInterval(timer);
                return 0;
              }
              return value - 1;
            });
          }, 1000);
        }}
      >
        Start 5-minute launch
      </button>
    </div>
  );
}
