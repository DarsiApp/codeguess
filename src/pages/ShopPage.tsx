import PageShell from '@/components/PageShell';
import { usePlayer } from '@/state/PlayerContext';

const PACKS = [
  { id: 'small', label: 'Small Pouch', coins: 50, price: '$0.99', bg: 'bg-paper' },
  { id: 'medium', label: 'Linen Sack', coins: 150, price: '$2.49', bg: 'bg-sky' },
  { id: 'large', label: 'Honey Jar', coins: 400, price: '$4.99', bg: 'bg-meadow' },
  { id: 'huge', label: 'Cottage Trove', coins: 1200, price: '$9.99', bg: 'bg-amber' },
];

export default function ShopPage() {
  const { addCoins } = usePlayer();
  return (
    <PageShell title="Shop" back="/">
      <p className="text-center text-sm font-bold text-muted">
        Real payments aren't wired up yet. Tap a pack to add coins for now.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {PACKS.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => addCoins(p.coins)}
              className={`flex w-full items-center justify-between gap-3 rounded-3xl border-3 border-line p-4 text-left shadow-nb transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-nbSm ${p.bg}`}
            >
              <span>
                <span className="block font-display text-lg font-black uppercase">{p.label}</span>
                <span className="text-sm font-extrabold">+{p.coins} coins</span>
              </span>
              <span className="pill bg-paper">{p.price}</span>
            </button>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
