import { useState } from 'react';
import { usePlayer } from '@/state/PlayerContext';

export default function UsernamePrompt() {
  const { username, setUsername } = usePlayer();
  const [val, setVal] = useState('');

  if (username) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bark/40 backdrop-blur-sm sm:items-center">
      <div className="card w-full max-w-md p-6 animate-pop">
        <h2 className="font-display text-2xl font-black">Welcome, friend</h2>
        <p className="mt-1 text-sm text-bark/70 dark:text-parchment/70">
          Pick a name to play under. You can change it later in your profile.
        </p>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = val.trim();
            if (trimmed.length < 2) return;
            setUsername(trimmed);
          }}
        >
          <input
            autoFocus
            className="input"
            placeholder="Your name"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            maxLength={20}
          />
          <button className="btn-primary w-full" type="submit" disabled={val.trim().length < 2}>
            Let's go
          </button>
        </form>
      </div>
    </div>
  );
}
