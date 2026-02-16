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
      <button className="primary" onClick={startVoice}>Start Voice Capture</button>
      <textarea
        style={{ width: "100%", minHeight: 100, marginTop: 8 }}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <button onClick={async () => setResult(await api("/v1/ai/parseTask", "POST", { text }))}>Parse</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
