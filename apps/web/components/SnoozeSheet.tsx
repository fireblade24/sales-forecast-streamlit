export function SnoozeSheet({ onPick }: { onPick: (m: number) => void }) {
  return <div className="row">{[10, 30, 60, 24 * 60].map((m) => <button key={m} onClick={() => onPick(m)}>{m === 1440 ? "Tomorrow" : `${m}m`}</button>)}</div>;
}
