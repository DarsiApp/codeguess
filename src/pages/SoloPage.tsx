import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '@/components/PageShell';
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

  if (phase === 'setup') {
    return (
      <SetupView
        mode={mode}
        setMode={setMode}
        allowRepeats={allowRepeats}
        setAllowRepeats={setAllowRepeats}
        onStart={startGame}
      />
    );
  }

  return (
    <PageShell title="Solo" back={false}>
      {showWin ? <Confetti /> : null}
      <GameBoard
        secret={secret}
        modeLabel={mode === 'word' ? 'Word' : 'Code'}
        onWin={handleWin}
      />
      <div className="mt-6 flex justify-center">
        <button className="btn-paper" onClick={() => setPhase('setup')}>
          New setup
        </button>
      </div>
    </PageShell>
  );
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
      <section className="card mx-auto max-w-md p-6">
        <h2 className="text-center font-display text-2xl font-black uppercase">
          Game Setup
        </h2>
        <p className="mt-1 text-center text-sm font-bold text-muted">
          Choose your mode and start cracking!
        </p>

        <p className="label mt-6 text-center">Mode</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <PickCard
            active={mode === 'word'}
            onClick={() => setMode('word')}
            emoji="📖"
            title="Word"
            sub="Real 5-letter words"
          />
          <PickCard
            active={mode === 'code'}
            onClick={() => setMode('code')}
            emoji="🔀"
            title="Code"
            sub="Any 5 letters A–Z"
          />
        </div>

        <hr className="my-6 border-line/15" />

        <p className="label text-center">Letter Repeats</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <PickCard
            active={allowRepeats}
            onClick={() => setAllowRepeats(true)}
            title="Allow"
            sub="Letters can repeat"
          />
          <PickCard
            active={!allowRepeats}
            onClick={() => setAllowRepeats(false)}
            title="Unique"
            sub="All letters unique"
          />
        </div>

        <button className="btn-sky mt-7 w-full text-base" onClick={onStart}>
          Start Game
        </button>
      </section>
    </PageShell>
  );
}

function PickCard({
  active,
  onClick,
  emoji,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  emoji?: string;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pick ${active ? 'pick-active' : ''}`}
      aria-pressed={active}
    >
      {emoji ? (
        <span className="text-2xl" aria-hidden>
          {emoji}
        </span>
      ) : null}
      <span className="font-display text-lg font-black">{title}</span>
      <span className="text-[11px] font-bold normal-case tracking-normal text-muted">
        {sub}
      </span>
    </button>
  );
}
