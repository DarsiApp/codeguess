import { useEffect, useState } from 'react';
import GuessRow from './GuessRow';
import Keyboard from './Keyboard';
import HistoryList from './HistoryList';
import { scoreGuess, type GuessFeedback } from '@/lib/score';

type Props = {
  secret: string;
  maxGuesses?: number;
  modeLabel?: string;
  hintsAvailable?: number;
  onUseHint?: () => void;
  disabled?: boolean;
  onGuess?: (fb: GuessFeedback) => void;
  onWin?: (fb: GuessFeedback, history: GuessFeedback[]) => void;
  onLose?: (history: GuessFeedback[]) => void;
};

export default function GameBoard({
  secret,
  maxGuesses,
  modeLabel,
  hintsAvailable = 0,
  onUseHint,
  disabled,
  onGuess,
  onWin,
  onLose,
}: Props) {
  const length = secret.length;
  const [current, setCurrent] = useState('');
  const [history, setHistory] = useState<GuessFeedback[]>([]);
  const finished =
    history.some((h) => h.exact === length) ||
    (maxGuesses !== undefined && history.length >= maxGuesses);

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

  const guessCount = history.length;
  const guessLimitLabel = maxGuesses ?? 10;

  return (
    <div className="space-y-5">
      {/* Status pill row -------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {modeLabel ? <span className="pill">{modeLabel}</span> : null}
        <span className="pill">
          Guess {Math.min(guessCount + 1, guessLimitLabel)} / {guessLimitLabel}
        </span>
        <button
          type="button"
          className="pill disabled:opacity-50"
          disabled={!onUseHint || hintsAvailable <= 0}
          onClick={onUseHint}
        >
          <span aria-hidden>👁</span>
          Hints {hintsAvailable > 0 ? `· ${hintsAvailable}` : ''}
        </button>
      </div>

      {/* Headline + slot row --------------------------------------------- */}
      <div className="text-center">
        <h2 className="font-display text-2xl font-black uppercase">
          {finished
            ? history[history.length - 1]?.exact === length
              ? 'You cracked it!'
              : 'Out of guesses'
            : guessCount === 0
              ? 'Enter your first guess!'
              : 'Keep going!'}
        </h2>
        <p className="mt-1 text-sm font-bold uppercase tracking-wider text-muted">
          {finished ? 'See history below' : 'Start cracking the code'}
        </p>
      </div>

      <GuessRow length={length} guess={current} active={!finished} />

      {/* History --------------------------------------------------------- */}
      {history.length > 0 ? (
        <section className="card max-h-72 space-y-2 overflow-auto p-4 sm:p-5">
          <h3 className="label">History</h3>
          <HistoryList history={history} length={length} />
        </section>
      ) : null}

      {/* Action row ----------------------------------------------------- */}
      <p className="text-center text-xs font-extrabold uppercase tracking-widest text-muted">
        Enter any {length} letters (A–Z)
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="btn-paper"
          onClick={onUseHint}
          disabled={!onUseHint || hintsAvailable <= 0 || finished}
        >
          Check Hint
        </button>
        <button
          type="button"
          className="btn-sky"
          onClick={submit}
          disabled={current.length !== length || finished || disabled}
        >
          Lock In Answer
        </button>
      </div>

      {/* Keyboard ------------------------------------------------------- */}
      <Keyboard
        history={history}
        onKey={appendKey}
        onEnter={submit}
        onBackspace={backspace}
        hidden={hwKeyboard}
        disabled={finished || disabled}
      />

      {hwKeyboard ? (
        <p className="text-center text-xs uppercase tracking-widest text-muted">
          Hardware keyboard detected · type to play
        </p>
      ) : null}
    </div>
  );
}
