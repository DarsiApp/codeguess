import { useNavigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useTheme } from '@/state/ThemeContext';
import { usePlayer } from '@/state/PlayerContext';

type Props = {
  title?: string;
  back?: boolean | string;
  children: ReactNode;
  rightSlot?: ReactNode;
};

export default function PageShell({ title, back = true, children, rightSlot }: Props) {
  const nav = useNavigate();
  const { theme, toggle } = useTheme();
  const { coins } = usePlayer();

  return (
    <div className="mx-auto flex min-h-full max-w-3xl flex-col px-4 pb-10 pt-4 sm:px-6 sm:pt-6">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {back ? (
            <button
              className="btn-ghost px-3 py-2"
              onClick={() => (typeof back === 'string' ? nav(back) : nav(-1))}
              aria-label="Back"
            >
              ←
            </button>
          ) : null}
          {title ? (
            <h1 className="font-display text-2xl font-black sm:text-3xl">{title}</h1>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {rightSlot}
          <span className="pill" title="Coins">
            <span aria-hidden>🪙</span>
            <span>{coins}</span>
          </span>
          <button
            className="btn-ghost px-3 py-2"
            onClick={toggle}
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
