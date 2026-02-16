"use client";
import { useState } from "react";

export function OverwhelmedMode() {
  const [seconds, setSeconds] = useState(300);
  return (
    <div className="card">
      <h3>Overwhelmed Mode</h3>
      <p>One tiny step: clear 10 emails (5-10 min).</p>
      <p>5-min timer: {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</p>
      <button className="primary" onClick={() => {
        const i = setInterval(() => setSeconds((s) => {
          if (s <= 1) { clearInterval(i); return 0; }
          return s - 1;
        }), 1000);
      }}>Start 5-minute launch</button>
    </div>
  );
}
