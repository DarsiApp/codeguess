import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import UsernamePrompt from '@/components/UsernamePrompt';
import { usePlayer } from '@/state/PlayerContext';

const TILES: Array<{ to: string; label: string; emoji: string; sub: string }> = [
  { to: '/solo', label: 'Solo', emoji: '🌿', sub: 'Play at your own pace' },
  { to: '/daily', label: 'Daily', emoji: '🌅', sub: 'One word for everyone' },
  { to: '/online', label: 'Online', emoji: '🐝', sub: 'Race friends in rooms' },
  { to: '/rules', label: 'Rules', emoji: '📜', sub: 'How to play' },
  { to: '/stats', label: 'Stats', emoji: '📊', sub: 'Streaks & badges' },
  { to: '/settings', label: 'Settings', emoji: '⚙️', sub: 'Theme, audio, more' },
];

export default function HomePage() {
  const { username } = usePlayer();
  return (
    <PageShell back={false}>
      <UsernamePrompt />
      <section className="card mb-6 flex items-center justify-between gap-4 p-5">
        <div>
          <p className="label">Hello{username ? `, ${username}` : ''}</p>
          <h1 className="font-display text-3xl font-black uppercase sm:text-4xl">Code Guess</h1>
          <p className="mt-1 text-sm text-bark/70 dark:text-parchment/70">
            Crack a five-letter secret. Hits = correct letters. Exact = right spot.
          </p>
        </div>
        <Link to="/shop" className="btn-secondary text-xs sm:text-sm" aria-label="Shop">
          🛒 Shop
        </Link>
      </section>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {TILES.map((t) => (
          <li key={t.to}>
            <Link
              to={t.to}
              className="flex h-full flex-col gap-1 rounded-3xl border-2 border-bark/20 bg-parchment/85 p-4 shadow-cottage transition hover:-translate-y-0.5 hover:bg-beige/80 dark:border-parchment/15 dark:bg-nightbeige/80 dark:hover:bg-nightsand/80"
            >
              <span className="text-2xl" aria-hidden>
                {t.emoji}
              </span>
              <span className="font-display text-lg font-black uppercase">{t.label}</span>
              <span className="text-xs text-bark/70 dark:text-parchment/60">{t.sub}</span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
