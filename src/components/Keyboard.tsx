import { useEffect, useMemo, useRef } from 'react';
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

export default function Keyboard({
  onKey,
  onEnter,
  onBackspace,
  history,
  hidden,
  disabled,
}: Props) {
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

  // Lookup of button refs so hardware-keyboard presses can replay the same
  // bump animation as a click — keeping the visual feedback consistent.
  const refs = useRef<Map<string, HTMLButtonElement>>(new Map());

  function bump(ch: string) {
    const el = refs.current.get(ch);
    if (!el) return;
    el.classList.remove('animate-bump');
    void el.offsetWidth; // restart the CSS animation
    el.classList.add('animate-bump');
  }

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
        bump('⌫');
        onBackspace();
      } else if (/^[a-zA-Z]$/.test(k)) {
        const upper = k.toUpperCase();
        bump(upper);
        onKey(upper);
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onKey, onEnter, onBackspace, disabled]);

  if (hidden) return null;

  function tone(ch: string) {
    const s = letterStatus[ch];
    if (s === 'exact') return 'bg-meadow';
    if (s === 'hit') return 'bg-amber';
    if (s === 'miss') return 'opacity-50';
    return '';
  }

  function tap(ch: string) {
    bump(ch);
    onKey(ch);
  }

  return (
    <div className="select-none space-y-2">
      {ROWS.slice(0, 2).map((row) => (
        <div key={row} className="flex justify-center gap-1.5">
          {row.split('').map((ch) => (
            <button
              key={ch}
              ref={(el) => {
                if (el) refs.current.set(ch, el);
                else refs.current.delete(ch);
              }}
              className={`key ${tone(ch)}`}
              onClick={() => tap(ch)}
              disabled={disabled}
              type="button"
            >
              {ch}
            </button>
          ))}
        </div>
      ))}
      <div className="flex justify-center gap-1.5">
        {ROWS[2].split('').map((ch) => (
          <button
            key={ch}
            ref={(el) => {
              if (el) refs.current.set(ch, el);
              else refs.current.delete(ch);
            }}
            className={`key ${tone(ch)}`}
            onClick={() => tap(ch)}
            disabled={disabled}
            type="button"
          >
            {ch}
          </button>
        ))}
        <button
          ref={(el) => {
            if (el) refs.current.set('⌫', el);
            else refs.current.delete('⌫');
          }}
          className="key min-w-[3rem] flex-[1.4]"
          onClick={() => {
            bump('⌫');
            onBackspace();
          }}
          disabled={disabled}
          type="button"
          aria-label="Backspace"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
