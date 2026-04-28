import type { GuessFeedback } from '@/lib/score';

export default function HistoryList({
  history,
  length = 5,
}: {
  history: GuessFeedback[];
  length?: number;
}) {
  if (history.length === 0) {
    return (
      <p className="text-center text-sm font-bold text-muted">
        No guesses yet — start tapping letters below.
      </p>
    );
  }
  return (
    <ol className="space-y-2" aria-label="Guess history">
      {history.map((fb, idx) => (
        <li
          key={idx}
          className="flex items-center justify-between gap-2 rounded-2xl border-3 border-line bg-wash p-2"
        >
          <div className="flex gap-1.5">
            {Array.from({ length }, (_, i) => {
              const s = fb.perSlot[i];
              const cls =
                s === 'exact'
                  ? 'bg-meadow'
                  : s === 'hit'
                    ? 'bg-amber'
                    : 'bg-paper';
              return (
                <span
                  key={i}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-3 border-line text-sm font-black ${cls}`}
                >
                  {fb.guess[i]}
                </span>
              );
            })}
          </div>
          <div className="flex shrink-0 gap-1.5 text-[10px] font-extrabold uppercase tracking-widest">
            <span className="rounded-full border-3 border-line bg-meadow px-2 py-1">
              ✓ {fb.exact}
            </span>
            <span className="rounded-full border-3 border-line bg-amber px-2 py-1">
              ◐ {fb.hits}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
