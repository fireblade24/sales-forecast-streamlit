export function SnoozeSheet({ onPick }: { onPick: (m: number) => void }) {
  return (
    <div className="card">
      <p className="kicker">Snooze</p>
      <div className="row">
        {[10, 30, 60, 24 * 60].map((minutes) => (
          <button key={minutes} onClick={() => onPick(minutes)}>
            {minutes === 1440 ? "Tomorrow" : `${minutes}m`}
          </button>
        ))}
      </div>
    </div>
  );
}
