"use client";
import { useState } from "react";
import { api } from "../../lib/api";

export default function InboxPage() {
  const [text, setText] = useState("");
  return (
    <div>
      <h2>Inbox Brain Dump</h2>
      <div className="card">
        <textarea style={{ width: "100%", minHeight: 120 }} value={text} onChange={(e) => setText(e.target.value)} />
        <div className="row">
          <button className="primary" onClick={async () => {
            const parsed = await api("/v1/ai/parseTask", "POST", { text });
            await api("/v1/tasks", "POST", { ...parsed, calendarId: "default", status: "inbox" });
            setText("");
          }}>Save to Inbox</button>
          <button onClick={() => api("/v1/plan/autoplanDay", "POST", { date: new Date().toISOString().slice(0, 10) })}>Schedule</button>
        </div>
      </div>
    </div>
  );
}
