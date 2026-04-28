import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import { usePlayer } from '@/state/PlayerContext';

type Mode = 'login' | 'signup';

export default function AuthPage() {
  const nav = useNavigate();
  const { setUsername } = usePlayer();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // No real backend wired up yet — we set the username from the email local
  // part so the rest of the app behaves as if you're signed in.
  function fakeSignIn(name?: string) {
    const fallback = email.split('@')[0] || 'Player';
    setUsername(name?.trim() || fallback);
    nav('/', { replace: true });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    fakeSignIn();
  }

  return (
    <PageShell title={mode === 'login' ? 'Log In' : 'Sign Up'} back="/">
      <p className="-mt-2 mb-6 text-center text-sm font-bold text-muted">
        {mode === 'login' ? 'Welcome back, codebreaker!' : 'Create your codebreaker account.'}
      </p>

      <section className="card mx-auto max-w-md space-y-3 p-5">
        <button
          type="button"
          className="btn-paper w-full"
          onClick={() => fakeSignIn('Google Friend')}
        >
          <span aria-hidden>🟦</span>
          <span>Continue with Google</span>
        </button>
        <button
          type="button"
          className="btn-paper w-full"
          onClick={() => fakeSignIn('Apple Friend')}
        >
          <span aria-hidden>🍎</span>
          <span>Continue with Apple</span>
        </button>

        <div className="my-2 flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-widest text-muted">
          <span className="h-[2px] flex-1 bg-line/15" />
          OR
          <span className="h-[2px] flex-1 bg-line/15" />
        </div>

        <form className="space-y-3" onSubmit={submit}>
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={4}
            required
          />
          <button className="btn-sky w-full" type="submit">
            {mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>
      </section>

      <p className="mt-4 text-center text-sm font-bold text-muted">
        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          className="font-extrabold uppercase underline"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        >
          {mode === 'login' ? 'Sign up' : 'Log in'}
        </button>
      </p>

      <p className="mt-2 text-center text-xs font-bold text-muted">
        Or just{' '}
        <Link to="/" className="underline">
          play as guest
        </Link>
        .
      </p>
    </PageShell>
  );
}
