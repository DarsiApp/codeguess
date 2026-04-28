import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';

export default function NotFoundPage() {
  return (
    <PageShell title="Lost Path" back="/">
      <section className="card p-8 text-center">
        <p className="text-5xl" aria-hidden>
          🦊
        </p>
        <h2 className="mt-3 font-display text-2xl font-black uppercase">Off the trail</h2>
        <p className="mt-1 text-sm font-bold text-muted">
          That page doesn't exist. Let's head back home.
        </p>
        <Link to="/" className="btn-sky mt-4 inline-flex">
          Back to home
        </Link>
      </section>
    </PageShell>
  );
}
