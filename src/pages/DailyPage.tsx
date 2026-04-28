import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import GameBoard from '@/components/GameBoard';
import Confetti from '@/components/Confetti';
import { dailyWord } from '@/lib/words';
import { load, save } from '@/lib/storage';

type DailyState = { date: string; result: 'won' | 'lost'; guesses: number };

const KEY = 'cg.daily';
const MAX = 6;

function todayKey(d = new Date()): string {
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
}

export default function DailyPage() {
  const word = useMemo(() => dailyWord(), []);
  const [done, setDone] = useState<DailyState | null>(() => {
    const saved = load<DailyState | null>(KEY, null);
    return saved && saved.date === todayKey() ? saved : null;
  });
  const [showWin, setShowWin] = useState(false);

  useEffect(() => {
    if (done) save(KEY, done);
  }, [done]);

  function finish(state: DailyState) {
    setDone(state);
    if (state.result === 'won') setShowWin(true);
  }

  return (
    <PageShell title="Daily" back="/">
      {showWin ? <Confetti /> : null}

      {done ? (
        <section className="card p-6 text-center">
          <p className="label">{done.result === 'won' ? 'Well played' : 'Tomorrow, then'}</p>
          <p className="mt-2 font-display text-3xl font-black tracking-[0.3em]">{word}</p>
          <p className="mt-3 text-sm font-bold text-muted">
            You {done.result === 'won' ? `solved it in ${done.guesses}/6` : `used all 6 guesses`}.
          </p>
          <p className="mt-2 text-xs font-bold text-muted">Come back tomorrow for a new word.</p>
          <Link className="btn-sky mt-5 inline-flex" to="/solo">
            Play solo while you wait
          </Link>
        </section>
      ) : (
        <GameBoard
          secret={word}
          maxGuesses={MAX}
          modeLabel={`Daily · ${new Date().toDateString()}`}
          onWin={(_fb, history) =>
            finish({ date: todayKey(), result: 'won', guesses: history.length })
          }
          onLose={(history) =>
            finish({ date: todayKey(), result: 'lost', guesses: history.length })
          }
        />
      )}
    </PageShell>
  );
}
