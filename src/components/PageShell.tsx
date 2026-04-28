import { Link, useNavigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { usePlayer } from '@/state/PlayerContext';

type Props = {
  title?: string;
  back?: boolean | string;
  children: ReactNode;
  /** Show the global header (sign-in pill on the left, coins on the right). */
  header?: 'global' | 'back' | 'none';
};

export default function PageShell({ title, back = true, children, header = 'back' }: Props) {
  return (
    <div className="mx-auto flex min-h-full max-w-3xl flex-col px-4 pb-10 pt-4 sm:px-6 sm:pt-6">
      {header === 'global' ? <GlobalHeader /> : null}
      {header === 'back' ? <BackHeader title={title} back={back} /> : null}
      <main className="flex-1 animate-pageEnter">{children}</main>
    </div>
  );
}

function GlobalHeader() {
  const { username, coins } = usePlayer();
  return (
    <header className="mb-8 flex items-center justify-between gap-3">
      <div className="inline-flex items-stretch overflow-hidden rounded-full border-3 border-line bg-paper shadow-nbSm">
        <Link
          to="/auth"
          className="flex items-center gap-2 px-4 py-2 font-extrabold uppercase tracking-wider"
        >
          <span aria-hidden>👤</span>
          <span>{username ? username : 'Sign In'}</span>
        </Link>
        <span className="my-2 w-[3px] bg-line" aria-hidden />
        <Link
          to="/friends"
          className="flex items-center gap-2 px-4 py-2 font-extrabold uppercase tracking-wider"
        >
          <span aria-hidden>👥</span>
          <span>Friends</span>
        </Link>
      </div>

      <div className="inline-flex items-stretch overflow-hidden rounded-full border-3 border-line bg-paper shadow-nbSm">
        <span className="flex items-center gap-2 px-4 py-2 font-extrabold uppercase tracking-wider">
          <span className="text-amber" aria-hidden>
            ●
          </span>
          <span>Coins: {coins}</span>
        </span>
        <Link
          to="/shop"
          className="flex items-center gap-1 bg-gold px-4 py-2 font-extrabold uppercase tracking-wider border-l-[3px] border-line"
        >
          + Buy
        </Link>
      </div>
    </header>
  );
}

function BackHeader({ title, back }: { title?: string; back: boolean | string }) {
  const nav = useNavigate();
  return (
    <header className="relative mb-6 flex items-center justify-center">
      {back ? (
        <button
          className="icon-btn absolute left-0 top-1/2 -translate-y-1/2"
          onClick={() => (typeof back === 'string' ? nav(back) : nav(-1))}
          aria-label="Back"
        >
          ←
        </button>
      ) : null}
      {title ? (
        <h1 className="font-display text-3xl font-black uppercase tracking-tight">{title}</h1>
      ) : null}
    </header>
  );
}
