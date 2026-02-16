"use client";
import { useState } from "react";
import { api } from "../../lib/api";

export default function TalkPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.onresult = (e: any) => setText(e.results[0][0].transcript);
    rec.start();
  };

  return (
    <div>
      <h2>Talk to capture</h2>
      <div className="card">
        <button className="primary" onClick={startVoice}>Start Voice Capture</button>
        <textarea style={{ width: "100%", minHeight: 100, marginTop: 8 }} value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={async () => setResult(await api("/v1/ai/parseTask", "POST", { text }))}>Parse</button>
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </div>
    </div>
  );
}
