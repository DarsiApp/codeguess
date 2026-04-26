import PageShell from '@/components/PageShell';

export default function RulesPage() {
  return (
    <PageShell title="Rules" back="/">
      <div className="space-y-4">
        <section className="card p-5">
          <h2 className="font-display text-xl font-black uppercase">How to play</h2>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
            <li>The game picks a secret 5-letter code.</li>
            <li>Type a guess and press Enter.</li>
            <li>Each guess is scored — keep guessing until you crack it.</li>
          </ol>
        </section>

        <section className="card p-5">
          <h2 className="font-display text-xl font-black uppercase">Hits vs Exact</h2>
          <p className="mt-2 text-sm">
            <span className="pill mr-2 bg-leaf/20 border-moss/40">✓ Exact</span>
            Letters in the right spot.
          </p>
          <p className="mt-2 text-sm">
            <span className="pill mr-2 bg-sand/40 border-clay/40">◐ Hits</span>
            Total correct letters anywhere — Exacts are counted in the Hits total too.
          </p>
        </section>

        <section className="card p-5">
          <h2 className="font-display text-xl font-black uppercase">Modes</h2>
          <ul className="mt-2 space-y-1 text-sm">
            <li><b>Solo</b>: unlimited guesses, your pace.</li>
            <li><b>Daily</b>: same word for everyone, six tries.</li>
            <li><b>Online</b>: take turns guessing a shared secret. Last guesser wins.</li>
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
