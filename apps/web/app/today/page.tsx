"use client";
import { useEffect, useState } from "react";
import { TaskCard } from "../../components/TaskCard";
import { SnoozeSheet } from "../../components/SnoozeSheet";
import { OverwhelmedMode } from "../../components/OverwhelmedMode";
import { api, registerPush } from "../../lib/api";

export default function TodayPage() {
  const [showSnooze, setShowSnooze] = useState(false);

  useEffect(() => {
    registerPush().then((token) => token && api("/v1/devices/register", "POST", { fcmToken: token, platform: "web" }));
  }, []);

  return (
    <div>
      <section className="page-header">
        <h1>Today Focus</h1>
        <p>Gentle momentum: Now, Next, Later.</p>
      </section>

      <div className="section-grid">
        <TaskCard title="NOW: Finish client email draft" onSnooze={() => setShowSnooze(true)} />
        <TaskCard title="NEXT: Prep standup notes" />
        <TaskCard title="LATER: 15m Quick Wins" />
      </div>

      {showSnooze && <SnoozeSheet onPick={(minutes) => api("/v1/tasks/demo/snooze", "POST", { minutes })} />}
      <OverwhelmedMode />
    </div>
  );
}
