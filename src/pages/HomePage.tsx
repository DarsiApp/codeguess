import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';

export default function HomePage() {
  // Toggle the diagonal pattern scroll on <html> while the home page is
  // mounted. Keeps other pages calm.
  useEffect(() => {
    document.documentElement.classList.add('scroll-bg');
    return () => document.documentElement.classList.remove('scroll-bg');
  }, []);

  return (
    <PageShell back={false} header="global">
      <div className="flex flex-col items-center gap-8 pt-2 pb-10 text-center">
        <div className="animate-pageEnter">
          <h1 className="font-display text-5xl font-black tracking-tight sm:text-6xl animate-floaty">
            Code Guess
          </h1>
          <p className="mt-3 font-extrabold uppercase tracking-wider text-muted">
            Crack the 5-letter code!
          </p>
        </div>

        <nav aria-label="Main game modes" className="grid w-full max-w-md gap-4">
          <Link
            to="/solo"
            className="home-btn bg-sky animate-pageEnter hover:animate-breathe"
            style={{ animationDelay: '60ms' }}
          >
            <span aria-hidden>👤</span>
            <span>Play Solo</span>
          </Link>
          <Link
            to="/online"
            className="home-btn bg-meadow animate-pageEnter hover:animate-breathe"
            style={{ animationDelay: '140ms' }}
          >
            <span aria-hidden>👥</span>
            <span>Play Online</span>
          </Link>
          <Link
            to="/daily"
            className="home-btn bg-amber animate-pageEnter hover:animate-breathe"
            style={{ animationDelay: '220ms' }}
          >
            <span aria-hidden>📅</span>
            <span>Daily Challenge</span>
          </Link>
        </nav>

        <div className="mt-2 grid w-full max-w-md grid-cols-5 gap-3">
          <DockTile to="/settings" label="Settings" emoji="⚙️" delay={300} />
          <DockTile to="/rules" label="Rules" emoji="❓" delay={360} />
          <DockTile to="/shop" label="Shop" emoji="🛒" delay={420} />
          <DockTile to="/stats" label="Stats" emoji="🏆" delay={480} />
          <DockTile to="/profile" label="Profile" emoji="👤" delay={540} />
        </div>
      </div>
    </PageShell>
  );
}

function DockTile({
  to,
  label,
  emoji,
  delay,
}: {
  to: string;
  label: string;
  emoji: string;
  delay: number;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-ink animate-pageEnter"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="grid h-14 w-14 place-items-center rounded-full border-3 border-line bg-paper text-2xl shadow-nbSm transition-transform group-hover:-translate-y-1 group-active:translate-x-[2px] group-active:translate-y-[2px]">
        <span className="inline-block group-hover:animate-wobble" aria-hidden>
          {emoji}
        </span>
      </span>
      <span>{label}</span>
    </Link>
  );
}
