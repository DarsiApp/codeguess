import { useState } from 'react';
import PageShell from '@/components/PageShell';
import { usePlayer } from '@/state/PlayerContext';
import { load } from '@/lib/storage';

type SoloRecords = { played: number; won: number; bestStreak: number };

export default function ProfilePage() {
  const { username, setUsername, coins } = usePlayer();
  const records = load<SoloRecords>('cg.solo.records', { played: 0, won: 0, bestStreak: 0 });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(username);

  return (
    <PageShell title="Profile" back="/">
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="card flex flex-col items-center gap-3 p-6 text-center">
          <span
            className="grid h-32 w-32 place-items-center rounded-full border-3 border-line bg-sky text-5xl shadow-nb"
            aria-hidden
          >
            👤
          </span>
          <p className="font-display text-2xl font-black uppercase">
            {username || 'Codebreaker'}
          </p>
          <p className="pill bg-gold">🪙 {coins} coins</p>
        </section>

        <section className="card space-y-4 p-5">
          <div>
            <p className="label">Username</p>
            {editing ? (
              <form
                className="mt-2 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (draft.trim().length >= 2) {
                    setUsername(draft);
                    setEditing(false);
                  }
                }}
              >
                <input
                  className="input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={20}
                  autoFocus
                />
                <button className="btn-sky px-4" type="submit">
                  Save
                </button>
              </form>
            ) : (
              <div className="mt-2 flex items-center justify-between gap-2 rounded-2xl border-3 border-line bg-wash px-4 py-3">
                <span className="font-extrabold">{username || 'Not set'}</span>
                <button
                  className="btn-ghost px-3 py-1 text-xs"
                  onClick={() => {
                    setDraft(username);
                    setEditing(true);
                  }}
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          <div>
            <p className="label">At a glance</p>
            <dl className="mt-2 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl border-3 border-line bg-wash p-3">
                <dt className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
                  Played
                </dt>
                <dd className="font-display text-xl font-black">{records.played}</dd>
              </div>
              <div className="rounded-2xl border-3 border-line bg-wash p-3">
                <dt className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
                  Won
                </dt>
                <dd className="font-display text-xl font-black">{records.won}</dd>
              </div>
              <div className="rounded-2xl border-3 border-line bg-wash p-3">
                <dt className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
                  Streak
                </dt>
                <dd className="font-display text-xl font-black">{records.bestStreak}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
