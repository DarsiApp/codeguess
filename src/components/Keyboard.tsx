import { useEffect, useMemo } from 'react';
import type { GuessFeedback } from '@/lib/score';

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

type Props = {
  onKey: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  history: GuessFeedback[];
  hidden?: boolean;
  disabled?: boolean;
};

export default function Keyboard({ onKey, onEnter, onBackspace, history, hidden, disabled }: Props) {
  const letterStatus = useMemo(() => {
    const map: Record<string, 'exact' | 'hit' | 'miss'> = {};
    const rank = { miss: 0, hit: 1, exact: 2 };
    for (const fb of history) {
      for (let i = 0; i < fb.guess.length; i++) {
        const ch = fb.guess[i];
        const s = fb.perSlot[i];
        if (!map[ch] || rank[s] > rank[map[ch]]) map[ch] = s;
      }
    }
    return map;
  }, [history]);

  // Hardware keyboard support — auto-detected via global listener.
  useEffect(() => {
    if (disabled) return;
    function handler(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (k === 'Enter') {
        e.preventDefault();
        onEnter();
      } else if (k === 'Backspace') {
        e.preventDefault();
        onBackspace();
      } else if (/^[a-zA-Z]$/.test(k)) {
        onKey(k.toUpperCase());
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onKey, onEnter, onBackspace, disabled]);

  if (hidden) return null;

  function tone(ch: string) {
    const s = letterStatus[ch];
    if (s === 'exact') return 'bg-leaf text-parchment border-moss';
    if (s === 'hit') return 'bg-sand text-bark border-clay/60';
    if (s === 'miss') return 'opacity-60';
    return '';
  }

  return (
    <div className="select-none space-y-2">
      {ROWS.map((row, idx) => (
        <div key={row} className="flex justify-center gap-1.5">
          {idx === 2 ? (
            <button
              className="key flex-[1.5] text-xs"
              onClick={onEnter}
              disabled={disabled}
              type="button"
            >
              Enter
            </button>
          ) : null}
          {row.split('').map((ch) => (
            <button
              key={ch}
              className={`key ${tone(ch)}`}
              onClick={() => onKey(ch)}
              disabled={disabled}
              type="button"
            >
              {ch}
            </button>
          ))}
          {idx === 2 ? (
            <button
              className="key flex-[1.5] text-xs"
              onClick={onBackspace}
              disabled={disabled}
              type="button"
              aria-label="Backspace"
            >
              ⌫
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
