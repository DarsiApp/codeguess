import type { GuessFeedback } from '@/lib/score';

export default function HistoryList({ history, length = 5 }: { history: GuessFeedback[]; length?: number }) {
  if (history.length === 0) {
    return (
      <p className="text-center text-sm text-bark/60 dark:text-parchment/60">
        No guesses yet — start tapping letters below.
      </p>
    );
  }
  return (
    <ol className="space-y-2" aria-label="Guess history">
      {history.map((fb, idx) => (
        <li key={idx} className="flex items-center justify-between gap-2 rounded-2xl border-2 border-bark/15 bg-parchment/60 p-2 dark:border-parchment/10 dark:bg-nightbeige/60">
          <div className="flex gap-1.5">
            {Array.from({ length }, (_, i) => {
              const s = fb.perSlot[i];
              const cls =
                s === 'exact'
                  ? 'slot-exact'
                  : s === 'hit'
                    ? 'slot-hit'
                    : 'bg-parchment dark:bg-nightcream';
              return (
                <span
                  key={i}
                  className={`flex h-9 w-8 items-center justify-center rounded-md border-2 border-bark/20 text-sm font-display font-black ${cls}`}
                >
                  {fb.guess[i]}
                </span>
              );
            })}
          </div>
          <div className="flex shrink-0 gap-1.5 text-xs font-extrabold uppercase tracking-wider">
            <span className="rounded-full bg-leaf/30 px-2 py-1">✓ {fb.exact}</span>
            <span className="rounded-full bg-sand/50 px-2 py-1">◐ {fb.hits}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
