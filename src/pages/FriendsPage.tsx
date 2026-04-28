import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import { usePlayer } from '@/state/PlayerContext';

export default function FriendsPage() {
  const { username } = usePlayer();

  if (!username) {
    return (
      <PageShell title="Friends" back="/">
        <section className="card p-8 text-center">
          <p className="text-3xl" aria-hidden>
            🤝
          </p>
          <p className="mt-3 font-display text-lg font-black uppercase">
            Sign in to add friends!
          </p>
          <Link to="/auth" className="btn-sky mt-4 inline-flex">
            Sign In
          </Link>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell title="Friends" back="/">
      <section className="card p-5 text-center">
        <p className="label">Your friends</p>
        <p className="mt-3 text-sm font-bold text-muted">
          You haven't added any friends yet. The friends system will light up once the
          backend is wired up — for now this is a placeholder.
        </p>
      </section>
    </PageShell>
  );
}
