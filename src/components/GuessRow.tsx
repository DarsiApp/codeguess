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
        // The `key` prop is what makes the fill animation replay each time
        // a letter is typed: changing the key remounts the cell so the
        // entrance animation runs again.
        const cellKey = feedback ? `fb-${i}-${feedback.guess[i]}` : `slot-${i}-${ch || 'empty'}`;
        return (
          <div
            key={cellKey}
            className={`${cls} ${ch && !feedback ? 'animate-fillSlot' : ''}`}
            style={status ? { animationDelay: `${i * 80}ms` } : undefined}
          >
            {ch || (!feedback ? '?' : '')}
          </div>
        );
      })}
    </div>
  );
}
