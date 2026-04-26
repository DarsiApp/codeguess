import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import HistoryList from '@/components/HistoryList';
import { usePlayer } from '@/state/PlayerContext';
import { load, save } from '@/lib/storage';
import type { GuessFeedback } from '@/lib/score';
import type { CodeMode } from '@/lib/words';

type ResultsState = {
  won: boolean;
  secret: string;
  history: GuessFeedback[];
  mode: CodeMode;
  allowRepeats: boolean;
  durationMs: number;
};

type SoloRecords = {
  played: number;
  won: number;
  bestGuessCount: number | null;
  bestTimeMs: number | null;
  currentStreak: number;
  bestStreak: number;
};

const RECORDS_KEY = 'cg.solo.records';
const DEFAULTS: SoloRecords = {
  played: 0,
  won: 0,
  bestGuessCount: null,
  bestTimeMs: null,
  currentStreak: 0,
  bestStreak: 0,
};

export default function SoloResultsPage() {
  const nav = useNavigate();
  const { state } = useLocation() as { state?: ResultsState };
  const { addCoins } = usePlayer();
  const [copied, setCopied] = useState(false);

  // If someone lands here with no result payload, send them back to setup.
  useEffect(() => {
    if (!state) nav('/solo', { replace: true });
  }, [state, nav]);

  // Update records once on mount, then award coins.
  const records = useMemo<SoloRecords>(() => {
    if (!state) return DEFAULTS;
    const prev = load<SoloRecords>(RECORDS_KEY, DEFAULTS);
    const guesses = state.history.length;
    const next: SoloRecords = {
      played: prev.played + 1,
      won: prev.won + (state.won ? 1 : 0),
      bestGuessCount: state.won
        ? prev.bestGuessCount === null
          ? guesses
          : Math.min(prev.bestGuessCount, guesses)
        : prev.bestGuessCount,
      bestTimeMs: state.won
        ? prev.bestTimeMs === null
          ? state.durationMs
          : Math.min(prev.bestTimeMs, state.durationMs)
        : prev.bestTimeMs,
      currentStreak: state.won ? prev.currentStreak + 1 : 0,
      bestStreak: state.won ? Math.max(prev.bestStreak, prev.currentStreak + 1) : prev.bestStreak,
    };
    save(RECORDS_KEY, next);
    return next;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state?.won) addCoins(20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!state) return null;

  const guesses = state.history.length;

  function copyShare() {
    const grid = state!.history
      .map((fb) => fb.perSlot.map((s) => (s === 'exact' ? '🟩' : s === 'hit' ? '🟨' : '⬜')).join(''))
      .join('\n');
    const head = `Code Guess · ${state!.won ? guesses : 'X'}/∞ · ${state!.mode === 'word' ? 'Word' : 'Code'}`;
    navigator.clipboard.writeText(`${head}\n${grid}`).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => {
        /* clipboard blocked */
      },
    );
  }

  return (
    <PageShell title={state.won ? 'You won!' : 'Better luck next time'} back="/">
      <div className="space-y-5">
        <section className={`card p-6 text-center ${state.won ? 'bg-leaf/10' : ''}`}>
          <p className="label">{state.won ? 'Cracked the code in' : 'The code was'}</p>
          {state.won ? (
            <p className="mt-1 font-display text-5xl font-black">{guesses}</p>
          ) : (
            <p className="mt-2 font-display text-3xl font-black tracking-[0.3em]">{state.secret}</p>
          )}
          <p className="mt-1 text-sm text-bark/70 dark:text-parchment/70">
            {state.won
              ? `${guesses === 1 ? 'guess' : 'guesses'} · ${formatDuration(state.durationMs)}`
              : `Played for ${formatDuration(state.durationMs)}`}
          </p>
          {state.won ? (
            <p className="mt-3 text-sm text-bark/70 dark:text-parchment/70">+20 🪙 added to your pouch</p>
          ) : null}
        </section>

        <section className="card p-5">
          <h2 className="font-display text-lg font-black uppercase">Your records</h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Played" value={records.played} />
            <Stat label="Won" value={records.won} />
            <Stat label="Win rate" value={`${winRate(records)}%`} />
            <Stat label="Streak" value={records.currentStreak} hint={`Best ${records.bestStreak}`} />
            <Stat label="Best guesses" value={records.bestGuessCount ?? '—'} />
            <Stat label="Best time" value={records.bestTimeMs !== null ? formatDuration(records.bestTimeMs) : '—'} />
            <Stat
              label="Mode"
              value={state.mode === 'word' ? 'Word' : 'Code'}
              hint={state.allowRepeats ? 'repeats on' : 'unique'}
            />
            <Stat label="Secret" value={state.secret} />
          </dl>
        </section>

        <section className="card p-5">
          <h2 className="font-display text-lg font-black uppercase">Your guesses</h2>
          <div className="mt-3">
            <HistoryList history={state.history} />
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-3">
          <button className="btn-primary" onClick={() => nav('/solo')}>
            Play again
          </button>
          <button className="btn-secondary" onClick={copyShare}>
            {copied ? 'Copied!' : 'Share result'}
          </button>
          <Link className="btn-ghost" to="/">
            Home
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border-2 border-bark/15 bg-parchment/60 p-3 dark:border-parchment/10 dark:bg-nightbeige/60">
      <dt className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-bark/60 dark:text-parchment/60">
        {label}
      </dt>
      <dd className="mt-0.5 font-display text-xl font-black">{value}</dd>
      {hint ? <p className="text-[11px] text-bark/60 dark:text-parchment/60">{hint}</p> : null}
    </div>
  );
}

function winRate(r: SoloRecords): number {
  if (r.played === 0) return 0;
  return Math.round((r.won / r.played) * 100);
}

function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m > 0 ? `${m}m ${s.toString().padStart(2, '0')}s` : `${s}s`;
}
