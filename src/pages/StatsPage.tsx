import { useState } from 'react';
import PageShell from '@/components/PageShell';
import { load, save } from '@/lib/storage';

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

const RANKS: Array<{ name: string; threshold: number }> = [
  { name: 'Novice', threshold: 0 },
  { name: 'Sprout', threshold: 5 },
  { name: 'Forager', threshold: 15 },
  { name: 'Cottager', threshold: 30 },
  { name: 'Cryptographer', threshold: 60 },
  { name: 'Master', threshold: 100 },
];

export default function StatsPage() {
  const [records, setRecords] = useState<SoloRecords>(() => load<SoloRecords>(RECORDS_KEY, DEFAULTS));
  const [confirmReset, setConfirmReset] = useState(false);

  const winRate = records.played === 0 ? 0 : Math.round((records.won / records.played) * 100);
  const rank =
    [...RANKS].reverse().find((r) => records.won >= r.threshold) ?? RANKS[0];
  const next = RANKS.find((r) => r.threshold > records.won);

  function reset() {
    save(RECORDS_KEY, DEFAULTS);
    setRecords(DEFAULTS);
    setConfirmReset(false);
  }

  return (
    <PageShell title="Stats" back="/">
      <div className="space-y-4">
        <section className="card p-5">
          <p className="label">Your rank</p>
          <p className="mt-1 font-display text-3xl font-black uppercase">{rank.name}</p>
          <p className="mt-1 text-sm text-bark/70 dark:text-parchment/60">
            {next
              ? `${next.threshold - records.won} more wins to reach ${next.name}`
              : 'You have reached the highest rank'}
          </p>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-beige dark:bg-nightsand">
            <div
              className="h-full bg-terracotta"
              style={{
                width: `${
                  next
                    ? Math.min(
                        100,
                        Math.round(
                          ((records.won - rank.threshold) / (next.threshold - rank.threshold)) * 100,
                        ),
                      )
                    : 100
                }%`,
              }}
            />
          </div>
        </section>

        <section className="card p-5">
          <h2 className="label">Solo records</h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Played" value={records.played} />
            <Stat label="Won" value={records.won} />
            <Stat label="Win rate" value={`${winRate}%`} />
            <Stat label="Streak" value={records.currentStreak} />
            <Stat label="Best streak" value={records.bestStreak} />
            <Stat label="Best guesses" value={records.bestGuessCount ?? '—'} />
          </dl>
        </section>

        <section className="card p-5">
          {confirmReset ? (
            <div className="space-y-3">
              <p className="text-sm">Reset all stats? This cannot be undone.</p>
              <div className="flex gap-2">
                <button className="btn-primary flex-1" onClick={reset}>
                  Reset
                </button>
                <button className="btn-ghost flex-1" onClick={() => setConfirmReset(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button className="btn-ghost w-full" onClick={() => setConfirmReset(true)}>
              Reset all stats
            </button>
          )}
        </section>
      </div>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border-2 border-bark/15 bg-parchment/60 p-3 dark:border-parchment/10 dark:bg-nightbeige/60">
      <dt className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-bark/60 dark:text-parchment/60">
        {label}
      </dt>
      <dd className="mt-0.5 font-display text-xl font-black">{value}</dd>
    </div>
  );
}
