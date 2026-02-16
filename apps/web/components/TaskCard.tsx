export function TaskCard({
  title,
  onDone,
  onSnooze,
  onSkip,
  onBreak
}: {
  title: string;
  onDone?: () => void;
  onSnooze?: () => void;
  onSkip?: () => void;
  onBreak?: () => void;
}) {
  const zone = title.split(":")[0].toLowerCase();
  const chipClass = zone.includes("now") ? "chip chip-now" : zone.includes("next") ? "chip chip-next" : "chip chip-later";

  return (
    <div className="card">
      <p className="kicker">Today Focus</p>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h3 className="task-title">{title}</h3>
        <span className={chipClass}>{zone.toUpperCase()}</span>
      </div>
      <div className="row">
        <button className="primary" onClick={onDone}>Done</button>
        <button onClick={onSnooze}>Snooze</button>
        <button onClick={onSkip}>Skip</button>
        <button onClick={onBreak}>Break</button>
      </div>
    </div>
  );
}
