import type { GuessFeedback } from '@/lib/score';

type Props = {
  length: number;
  guess?: string;
  feedback?: GuessFeedback;
  active?: boolean;
};

export default function GuessRow({ length, guess = '', feedback, active }: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length }, (_, i) => {
        const ch = feedback ? feedback.guess[i] : guess[i] ?? '';
        const status = feedback?.perSlot[i];
        const cls =
          status === 'exact'
            ? 'slot slot-exact animate-flip'
            : status === 'hit'
              ? 'slot slot-hit animate-flip'
              : `slot ${active && i === guess.length ? 'slot-active' : ''}`;
        return (
          <div key={i} className={cls} style={status ? { animationDelay: `${i * 80}ms` } : undefined}>
            {ch}
          </div>
        );
      })}
      {feedback ? (
        <div className="ml-3 hidden flex-col items-center gap-1 sm:flex">
          <span className="pill bg-leaf/20 border-moss/40 text-bark dark:text-parchment">
            ✓ {feedback.exact}
          </span>
          <span className="pill bg-sand/40 border-clay/40 text-bark dark:text-parchment">
            ◐ {feedback.hits}
          </span>
        </div>
      ) : null}
    </div>
  );
}
