import type { GuessFeedback } from '@/lib/score';

type Props = {
  length: number;
  guess?: string;
  feedback?: GuessFeedback;
  active?: boolean;
};

export default function GuessRow({ length, guess = '', feedback, active }: Props) {
  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length }, (_, i) => {
        const ch = feedback ? feedback.guess[i] : guess[i] ?? '';
        const status = feedback?.perSlot[i];
        let cls = 'slot';
        if (status === 'exact') cls += ' slot-exact animate-flip';
        else if (status === 'hit') cls += ' slot-hit animate-flip';
        else if (!ch) cls += ' slot-empty';
        if (!feedback && active && i === guess.length) cls += ' slot-active';
        return (
          <div
            key={i}
            className={cls}
            style={status ? { animationDelay: `${i * 80}ms` } : undefined}
          >
            {ch || (!feedback ? '?' : '')}
          </div>
        );
      })}
    </div>
  );
}
