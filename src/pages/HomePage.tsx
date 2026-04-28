import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';

export default function HomePage() {
  return (
    <PageShell back={false} header="global">
      <div className="flex flex-col items-center gap-8 pt-2 pb-10 text-center">
        <div>
          <h1 className="font-display text-5xl font-black tracking-tight sm:text-6xl">
            Code Guess
          </h1>
          <p className="mt-3 font-extrabold uppercase tracking-wider text-muted">
            Crack the 5-letter code!
          </p>
        </div>

        <nav aria-label="Main game modes" className="grid w-full max-w-md gap-4">
          <Link to="/solo" className="home-btn bg-sky">
            <span aria-hidden>👤</span>
            <span>Play Solo</span>
          </Link>
          <Link to="/online" className="home-btn bg-meadow">
            <span aria-hidden>👥</span>
            <span>Play Online</span>
          </Link>
          <Link to="/daily" className="home-btn bg-amber">
            <span aria-hidden>📅</span>
            <span>Daily Challenge</span>
          </Link>
        </nav>

        <div className="mt-2 grid w-full max-w-md grid-cols-5 gap-3">
          <DockTile to="/settings" label="Settings" emoji="⚙️" />
          <DockTile to="/rules" label="Rules" emoji="❓" />
          <DockTile to="/shop" label="Shop" emoji="🛒" />
          <DockTile to="/stats" label="Stats" emoji="🏆" />
          <DockTile to="/profile" label="Profile" emoji="👤" />
        </div>
      </div>
    </PageShell>
  );
}

function DockTile({ to, label, emoji }: { to: string; label: string; emoji: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-ink">
      <span className="grid h-14 w-14 place-items-center rounded-full border-3 border-line bg-paper text-2xl shadow-nbSm transition-transform active:translate-x-[2px] active:translate-y-[2px]">
        {emoji}
      </span>
      <span>{label}</span>
    </Link>
  );
}
