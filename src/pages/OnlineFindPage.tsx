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
    <PageShell title="Find Game" back="/online">
      <div className="space-y-4">
        <p className="text-center text-sm font-bold text-muted">
          Open public lobbies waiting for players. Join one to take a turn.
        </p>
        {rooms.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-3xl" aria-hidden>
              🌾
            </p>
            <p className="mt-3 font-display text-lg font-black uppercase">All quiet right now</p>
            <p className="mt-1 text-sm font-bold text-muted">
              No public rooms are open. Why not host one yourself?
            </p>
            <button className="btn-sky mt-4" onClick={() => nav('/online/create')}>
              Create a Room
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {rooms.map((r) => (
              <li key={r.code}>
                <button
                  className="flex w-full items-center justify-between gap-3 rounded-3xl border-3 border-line bg-paper p-4 text-left shadow-nb transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-nbSm"
                  onClick={() => join(r.code)}
                >
                  <div className="min-w-0">
                    <p className="font-display text-lg font-black tracking-[0.25em]">{r.code}</p>
                    <p className="truncate text-xs font-bold text-muted">
                      Hosted by {r.players[0]?.nickname ?? 'Host'} ·{' '}
                      {r.mode === 'word' ? 'Word' : 'Code'}
                      {r.allowRepeats ? ' · repeats' : ' · unique'}
                    </p>
                  </div>
                  <span className="pill">👥 {r.players.length}/8</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}
