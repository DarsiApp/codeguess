import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';

const TILES = [
  {
    to: '/online/create',
    title: 'Create Room',
    sub: 'Host a private or public lobby',
    emoji: '🏡',
    bg: 'bg-meadow',
  },
  {
    to: '/online/join',
    title: 'Join Room',
    sub: 'Enter a 6-character code',
    emoji: '🔑',
    bg: 'bg-sky',
  },
  {
    to: '/online/find',
    title: 'Find Game',
    sub: 'Browse open public rooms',
    emoji: '🌻',
    bg: 'bg-amber',
  },
];

export default function OnlineMenuPage() {
  return (
    <PageShell title="Online" back="/">
      <ul className="space-y-3">
        {TILES.map((t) => (
          <li key={t.to}>
            <Link
              to={t.to}
              className={`flex items-center gap-4 rounded-3xl border-3 border-line p-5 shadow-nb transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-nbSm ${t.bg}`}
            >
              <span className="text-3xl" aria-hidden>
                {t.emoji}
              </span>
              <span>
                <span className="block font-display text-lg font-black uppercase">{t.title}</span>
                <span className="text-sm font-bold">{t.sub}</span>
              </span>
              <span className="ml-auto text-xl">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
