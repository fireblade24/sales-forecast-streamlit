"use client";
import { useState } from "react";
import { api } from "../../lib/api";

export default function InboxPage() {
  const [text, setText] = useState("");

  return (
    <div>
      <section className="page-header">
        <h2>Inbox</h2>
        <p>Brain dump first. Organize after.</p>
      </section>

      <div className="card">
        <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Say or type anything on your mind…" />
        <div className="row" style={{ marginTop: 10 }}>
          <button
            className="primary"
            onClick={async () => {
              const parsed = await api("/v1/ai/parseTask", "POST", { text });
              await api("/v1/tasks", "POST", { ...parsed, calendarId: "default", status: "inbox" });
              setText("");
            }}
          >
            Save to Inbox
          </button>
          <button onClick={() => api("/v1/plan/autoplanDay", "POST", { date: new Date().toISOString().slice(0, 10) })}>
            Schedule Today
          </button>
        </div>
      </div>
    </div>
  );
}
