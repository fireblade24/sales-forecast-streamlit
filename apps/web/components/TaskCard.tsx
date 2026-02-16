export function TaskCard({ title, onDone, onSnooze, onSkip, onBreak }: { title: string; onDone?: () => void; onSnooze?: () => void; onSkip?: () => void; onBreak?: () => void; }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="row">
        <button className="primary" onClick={onDone}>Done</button>
        <button onClick={onSnooze}>Snooze</button>
        <button onClick={onSkip}>Skip</button>
        <button onClick={onBreak}>Break</button>
      </div>
    </div>
  );
}
