"use client";
import { useEffect, useState } from "react";
import { TaskCard } from "../../components/TaskCard";
import { SnoozeSheet } from "../../components/SnoozeSheet";
import { OverwhelmedMode } from "../../components/OverwhelmedMode";
import { api, registerPush } from "../../lib/api";

export default function TodayPage() {
  const [showSnooze, setShowSnooze] = useState(false);
  useEffect(() => { registerPush().then((t) => t && api("/v1/devices/register", "POST", { fcmToken: t, platform: "web" })); }, []);

  return (
    <div>
      <h2>Today Focus</h2>
      <TaskCard title="NOW: Finish client email draft" onSnooze={() => setShowSnooze(true)} />
      <TaskCard title="NEXT: Prep standup notes" />
      <TaskCard title="LATER: 15m Quick Wins" />
      {showSnooze && <SnoozeSheet onPick={(m) => api("/v1/tasks/demo/snooze", "POST", { minutes: m })} />}
      <OverwhelmedMode />
    </div>
  );
}
