import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { load, save } from '@/lib/storage';

type Theme = 'light' | 'dark';

type ThemeCtx = {
  theme: Theme;
  toggle: () => void;
  set: (t: Theme) => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => load<Theme>('cg.theme', 'light'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    save('cg.theme', theme);
  }, [theme]);

  const value = useMemo<ThemeCtx>(
    () => ({
      theme,
      toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
      set: setTheme,
    }),
    [theme],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTheme outside provider');
  return v;
}
