"use client";

import { useState } from "react";
import { api } from "../lib/api";

type SpeechRecognitionResultEvent = Event & {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognitionInstance = {
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  start: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

type WindowWithSpeech = Window & {
  SpeechRecognition?: SpeechRecognitionCtor;
  webkitSpeechRecognition?: SpeechRecognitionCtor;
};

export function TalkCaptureClient() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<unknown>(null);

  const startVoice = () => {
    const speechWindow = window as WindowWithSpeech;
    const SpeechRecognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) setText(transcript);
    };
    recognition.start();
  };

  return (
    <div className="card">
      <p className="kicker">Voice Capture</p>
      <button className="primary" onClick={startVoice}>Start Voice Capture</button>
      <textarea
        style={{ marginTop: 10 }}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Try: 'Tomorrow at 10, 25 minutes to call insurance'"
      />
      <div className="row" style={{ marginTop: 10 }}>
        <button onClick={async () => setResult(await api("/v1/ai/parseTask", "POST", { text }))}>Parse Task</button>
      </div>
      {result !== null && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
