import { TalkCaptureClient } from "../../components/TalkCaptureClient";

export default function TalkPage() {
  return (
    <div>
      <section className="page-header">
        <h2>Talk</h2>
        <p>Speak naturally. We’ll turn it into a clear next task.</p>
      </section>
      <TalkCaptureClient />
    </div>
  );
}
