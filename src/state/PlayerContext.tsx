import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { load, save } from '@/lib/storage';

type Player = {
  username: string;
  coins: number;
};

type Ctx = Player & {
  setUsername: (n: string) => void;
  addCoins: (n: number) => void;
  spendCoins: (n: number) => boolean;
};

const PlayerCtx = createContext<Ctx | null>(null);

const KEY = 'cg.player';
const DEFAULT: Player = { username: '', coins: 50 };

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player>(() => load<Player>(KEY, DEFAULT));

  useEffect(() => save(KEY, player), [player]);

  const value = useMemo<Ctx>(
    () => ({
      ...player,
      setUsername: (n) => setPlayer((p) => ({ ...p, username: n.trim().slice(0, 20) })),
      addCoins: (n) => setPlayer((p) => ({ ...p, coins: p.coins + n })),
      spendCoins: (n) => {
        if (player.coins < n) return false;
        setPlayer((p) => ({ ...p, coins: p.coins - n }));
        return true;
      },
    }),
    [player],
  );

  return <PlayerCtx.Provider value={value}>{children}</PlayerCtx.Provider>;
}

export function usePlayer() {
  const v = useContext(PlayerCtx);
  if (!v) throw new Error('usePlayer outside provider');
  return v;
}
