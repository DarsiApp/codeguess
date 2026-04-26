import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';

const TILES = [
  {
    to: '/online/create',
    title: 'Create room',
    sub: 'Host a private or public lobby',
    emoji: '🏡',
  },
  {
    to: '/online/join',
    title: 'Join room',
    sub: 'Enter a 6-character code',
    emoji: '🔑',
  },
  {
    to: '/online/find',
    title: 'Find game',
    sub: 'Browse open public rooms',
    emoji: '🌻',
  },
];

export default function OnlineMenuPage() {
  return (
    <PageShell title="Online" back="/">
      <ul className="grid gap-3">
        {TILES.map((t) => (
          <li key={t.to}>
            <Link
              to={t.to}
              className="flex items-center gap-4 rounded-3xl border-2 border-bark/20 bg-parchment/85 p-5 shadow-cottage transition hover:-translate-y-0.5 dark:border-parchment/15 dark:bg-nightbeige/80"
            >
              <span className="text-3xl" aria-hidden>
                {t.emoji}
              </span>
              <span>
                <span className="block font-display text-lg font-black uppercase">{t.title}</span>
                <span className="text-sm text-bark/70 dark:text-parchment/60">{t.sub}</span>
              </span>
              <span className="ml-auto text-xl">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
