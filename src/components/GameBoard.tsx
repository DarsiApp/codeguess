import { useEffect, useState } from 'react';
import GuessRow from './GuessRow';
import Keyboard from './Keyboard';
import HistoryList from './HistoryList';
import { scoreGuess, type GuessFeedback } from '@/lib/score';

type Props = {
  secret: string;
  maxGuesses?: number;
  disabled?: boolean;
  onGuess?: (fb: GuessFeedback) => void;
  onWin?: (fb: GuessFeedback, history: GuessFeedback[]) => void;
  onLose?: (history: GuessFeedback[]) => void;
};

export default function GameBoard({ secret, maxGuesses, disabled, onGuess, onWin, onLose }: Props) {
  const length = secret.length;
  const [current, setCurrent] = useState('');
  const [history, setHistory] = useState<GuessFeedback[]>([]);
  const finished =
    history.some((h) => h.exact === length) ||
    (maxGuesses !== undefined && history.length >= maxGuesses);

  // Hardware keyboard detection — once any physical key is pressed we
  // auto-hide the on-screen keyboard for the rest of the session.
  const [hwKeyboard, setHwKeyboard] = useState(false);
  useEffect(() => {
    function detect(e: KeyboardEvent) {
      if (e.isTrusted && /^[a-zA-Z]$/.test(e.key)) setHwKeyboard(true);
    }
    window.addEventListener('keydown', detect);
    return () => window.removeEventListener('keydown', detect);
  }, []);

  function appendKey(k: string) {
    if (finished || disabled) return;
    if (current.length < length) setCurrent((c) => c + k);
  }
  function backspace() {
    if (finished || disabled) return;
    setCurrent((c) => c.slice(0, -1));
  }
  function submit() {
    if (finished || disabled) return;
    if (current.length !== length) return;
    const fb = scoreGuess(secret, current);
    const next = [...history, fb];
    setHistory(next);
    setCurrent('');
    onGuess?.(fb);
    if (fb.exact === length) onWin?.(fb, next);
    else if (maxGuesses !== undefined && next.length >= maxGuesses) onLose?.(next);
  }

  return (
    <div className="space-y-5">
      <div className="card space-y-4 p-4 sm:p-6">
        <GuessRow length={length} guess={current} active={!finished} />
        {maxGuesses !== undefined ? (
          <p className="text-center text-xs font-bold uppercase tracking-widest text-bark/60 dark:text-parchment/60">
            Guess {Math.min(history.length + 1, maxGuesses)} / {maxGuesses}
          </p>
        ) : null}
      </div>

      <section className="card max-h-72 space-y-2 overflow-auto p-4 sm:p-5">
        <h2 className="text-sm font-extrabold uppercase tracking-widest text-bark/70 dark:text-parchment/70">
          History
        </h2>
        <HistoryList history={history} length={length} />
      </section>

      <Keyboard
        history={history}
        onKey={appendKey}
        onEnter={submit}
        onBackspace={backspace}
        hidden={hwKeyboard}
        disabled={finished || disabled}
      />

      {hwKeyboard ? (
        <p className="text-center text-xs uppercase tracking-widest text-bark/50 dark:text-parchment/50">
          Hardware keyboard detected · type to play
        </p>
      ) : null}
    </div>
  );
}
