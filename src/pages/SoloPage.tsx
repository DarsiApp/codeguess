import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import Toggle from '@/components/Toggle';
import GameBoard from '@/components/GameBoard';
import Confetti from '@/components/Confetti';
import { generateSecret, type CodeMode } from '@/lib/words';
import type { GuessFeedback } from '@/lib/score';

type Phase = 'setup' | 'play';

export default function SoloPage() {
  const nav = useNavigate();
  const [phase, setPhase] = useState<Phase>('setup');
  const [mode, setMode] = useState<CodeMode>('word');
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [secret, setSecret] = useState('');
  const [startedAt, setStartedAt] = useState(0);
  const [showWin, setShowWin] = useState(false);

  function startGame() {
    const next = generateSecret(mode, allowRepeats);
    setSecret(next);
    setStartedAt(Date.now());
    setPhase('play');
    setShowWin(false);
  }

  function handleWin(_fb: GuessFeedback, history: GuessFeedback[]) {
    setShowWin(true);
    // Brief pause so the player sees the green row before navigating.
    setTimeout(() => {
      nav('/solo/results', {
        state: {
          won: true,
          secret,
          history,
          mode,
          allowRepeats,
          durationMs: Date.now() - startedAt,
        },
      });
    }, 1600);
  }

  if (phase === 'setup') return <SetupView mode={mode} setMode={setMode} allowRepeats={allowRepeats} setAllowRepeats={setAllowRepeats} onStart={startGame} />;

  return <PlayView secret={secret} mode={mode} allowRepeats={allowRepeats} onWin={handleWin} showWin={showWin} onAbandon={() => setPhase('setup')} />;
}

function SetupView({
  mode,
  setMode,
  allowRepeats,
  setAllowRepeats,
  onStart,
}: {
  mode: CodeMode;
  setMode: (m: CodeMode) => void;
  allowRepeats: boolean;
  setAllowRepeats: (v: boolean) => void;
  onStart: () => void;
}) {
  return (
    <PageShell title="Solo" back="/">
      <div className="space-y-5">
        <section className="card p-5">
          <p className="label">New game setup</p>
          <h2 className="mt-1 font-display text-2xl font-black uppercase">Pick your puzzle</h2>
          <p className="mt-1 text-sm text-bark/70 dark:text-parchment/70">
            Choose the kind of secret you want to crack. You can play unlimited guesses in solo.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <ModeCard
              active={mode === 'word'}
              title="Word"
              emoji="🌼"
              hint="A real five-letter word"
              onClick={() => setMode('word')}
            />
            <ModeCard
              active={mode === 'code'}
              title="Code"
              emoji="🔣"
              hint="Random letters, max chaos"
              onClick={() => setMode('code')}
            />
          </div>

          <div className="mt-4">
            <Toggle
              checked={allowRepeats}
              onChange={setAllowRepeats}
              label="Allow repeated letters"
              hint={mode === 'word' ? 'Unlocks words like APPLE or BERRY.' : 'Otherwise every letter is unique.'}
            />
          </div>
        </section>

        <button className="btn-primary w-full text-base" onClick={onStart}>
          Start game →
        </button>
      </div>
    </PageShell>
  );
}

function ModeCard({
  active,
  title,
  emoji,
  hint,
  onClick,
}: {
  active: boolean;
  title: string;
  emoji: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start gap-1 rounded-2xl border-2 p-4 text-left shadow-cottageSm transition ${
        active
          ? 'border-clay bg-terracotta text-parchment'
          : 'border-bark/25 bg-parchment hover:bg-beige dark:border-parchment/15 dark:bg-nightbeige dark:hover:bg-nightsand'
      }`}
    >
      <span className="text-2xl" aria-hidden>
        {emoji}
      </span>
      <span className="font-display text-lg font-black uppercase tracking-wide">{title}</span>
      <span className={`text-xs ${active ? 'text-parchment/80' : 'text-bark/60 dark:text-parchment/60'}`}>{hint}</span>
    </button>
  );
}

function PlayView({
  secret,
  mode,
  allowRepeats,
  onWin,
  showWin,
  onAbandon,
}: {
  secret: string;
  mode: CodeMode;
  allowRepeats: boolean;
  onWin: (fb: GuessFeedback, history: GuessFeedback[]) => void;
  showWin: boolean;
  onAbandon: () => void;
}) {
  const subtitle = useMemo(
    () => `${mode === 'word' ? 'Word mode' : 'Code mode'} · ${allowRepeats ? 'repeats on' : 'unique letters'}`,
    [mode, allowRepeats],
  );
  return (
    <PageShell title="Solo" back={false}>
      <div className="mb-3 flex items-center justify-between">
        <p className="label">{subtitle}</p>
        <button className="btn-ghost px-3 py-2 text-xs" onClick={onAbandon}>
          New setup
        </button>
      </div>
      {showWin ? <Confetti /> : null}
      <GameBoard secret={secret} onWin={onWin} />
    </PageShell>
  );
}
