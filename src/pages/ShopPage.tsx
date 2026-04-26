import PageShell from '@/components/PageShell';
import { usePlayer } from '@/state/PlayerContext';

const PACKS = [
  { id: 'small', label: 'Small pouch', coins: 50, price: '$0.99' },
  { id: 'medium', label: 'Linen sack', coins: 150, price: '$2.49' },
  { id: 'large', label: 'Honey jar', coins: 400, price: '$4.99' },
  { id: 'huge', label: 'Cottage trove', coins: 1200, price: '$9.99' },
];

export default function ShopPage() {
  const { addCoins } = usePlayer();
  return (
    <PageShell title="Shop" back="/">
      <p className="text-sm text-bark/70 dark:text-parchment/60">
        Real payments aren't wired up yet. Tap a pack to add coins for now.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {PACKS.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => addCoins(p.coins)}
              className="flex w-full items-center justify-between gap-3 rounded-3xl border-2 border-bark/20 bg-parchment/85 p-4 text-left shadow-cottageSm dark:border-parchment/15 dark:bg-nightbeige/80"
            >
              <span>
                <span className="block font-display text-lg font-black uppercase">{p.label}</span>
                <span className="text-sm text-bark/70 dark:text-parchment/60">+{p.coins} 🪙</span>
              </span>
              <span className="pill">{p.price}</span>
            </button>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
