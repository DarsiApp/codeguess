import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import { joinRoom, listPublicRooms, type Room } from '@/lib/rooms';
import { usePlayer } from '@/state/PlayerContext';

export default function OnlineFindPage() {
  const nav = useNavigate();
  const { username } = usePlayer();
  const [rooms, setRooms] = useState<Room[]>(() => listPublicRooms());

  useEffect(() => {
    function refresh() {
      setRooms(listPublicRooms());
    }
    const t = window.setInterval(refresh, 1000);
    window.addEventListener('storage', refresh);
    return () => {
      window.clearInterval(t);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  function join(code: string) {
    const r = joinRoom(code, username || 'Player');
    if ('error' in r) return;
    nav(`/online/game/${r.code}`);
  }

  return (
    <PageShell title="Find game" back="/online">
      <div className="space-y-4">
        <p className="text-sm text-bark/70 dark:text-parchment/70">
          Open public lobbies waiting for players. Join one to take a turn at the secret.
        </p>
        {rooms.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-3xl" aria-hidden>
              🌾
            </p>
            <p className="mt-3 font-display text-lg font-black uppercase">All quiet right now</p>
            <p className="mt-1 text-sm text-bark/70 dark:text-parchment/70">
              No public rooms are open. Why not host one yourself?
            </p>
            <button className="btn-primary mt-4" onClick={() => nav('/online/create')}>
              Create a room
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {rooms.map((r) => (
              <li key={r.code}>
                <button
                  className="flex w-full items-center justify-between gap-3 rounded-3xl border-2 border-bark/20 bg-parchment/85 p-4 text-left shadow-cottageSm transition hover:-translate-y-0.5 dark:border-parchment/15 dark:bg-nightbeige/80"
                  onClick={() => join(r.code)}
                >
                  <div className="min-w-0">
                    <p className="font-display text-lg font-black tracking-[0.25em]">{r.code}</p>
                    <p className="truncate text-xs text-bark/70 dark:text-parchment/60">
                      Hosted by {r.players[0]?.nickname ?? 'Host'} · {r.mode === 'word' ? 'Word' : 'Code'}
                      {r.allowRepeats ? ' · repeats' : ' · unique'}
                    </p>
                  </div>
                  <span className="pill">
                    👥 {r.players.length}/8
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}
