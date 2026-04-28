import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import { joinRoom } from '@/lib/rooms';
import { usePlayer } from '@/state/PlayerContext';

const LEN = 6;
const CHARSET = /^[A-Z2-9]$/;

export default function OnlineJoinPage() {
  const nav = useNavigate();
  const { username } = usePlayer();
  const [code, setCode] = useState<string[]>(Array.from({ length: LEN }, () => ''));
  const [nickname, setNickname] = useState(username || '');
  const [error, setError] = useState<string | null>(null);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  function update(i: number, val: string) {
    const upper = val.toUpperCase().slice(-1);
    const valid = upper === '' || CHARSET.test(upper);
    if (!valid) return;
    setCode((prev) => {
      const next = [...prev];
      next[i] = upper;
      return next;
    });
    if (upper && i < LEN - 1) refs.current[i + 1]?.focus();
  }

  function onKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  }

  function onPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z2-9]/g, '');
    if (!text) return;
    e.preventDefault();
    const next = [...code];
    for (let i = 0; i < LEN; i++) next[i] = text[i] ?? '';
    setCode(next);
    refs.current[Math.min(text.length, LEN - 1)]?.focus();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const joined = code.join('');
    if (joined.length !== LEN) {
      setError('Enter all 6 characters');
      return;
    }
    const result = joinRoom(joined, nickname.trim() || 'Player');
    if ('error' in result) {
      setError(result.error);
      return;
    }
    nav(`/online/game/${result.code}`);
  }

  return (
    <PageShell title="Join Room" back="/online">
      <form className="mx-auto max-w-md space-y-5" onSubmit={submit}>
        <section className="card space-y-5 p-5">
          <div>
            <label className="label" htmlFor="join-nick">
              Your nickname
            </label>
            <input
              id="join-nick"
              className="input mt-2"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Robin"
              maxLength={20}
              required
            />
          </div>

          <div>
            <p className="label">Room code</p>
            <div className="mt-2 flex justify-between gap-1.5 sm:gap-2" onPaste={onPaste}>
              {code.map((ch, i) => (
                <input
                  key={i}
                  ref={(el) => (refs.current[i] = el)}
                  className="h-14 w-12 rounded-2xl border-3 border-line bg-paper text-center font-display text-2xl font-black uppercase shadow-nbSm focus:ring-4 focus:ring-sky/40 sm:h-16 sm:w-14"
                  inputMode="text"
                  autoCapitalize="characters"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={ch}
                  aria-label={`Code character ${i + 1}`}
                  onChange={(e) => update(i, e.target.value)}
                  onKeyDown={(e) => onKey(i, e)}
                  onFocus={(e) => e.currentTarget.select()}
                />
              ))}
            </div>
          </div>

          {error ? (
            <p className="rounded-2xl border-3 border-line bg-amber/30 p-3 text-sm font-extrabold uppercase tracking-wide">
              {error}
            </p>
          ) : null}
        </section>

        <button
          className="btn-sky w-full"
          type="submit"
          disabled={code.join('').length < LEN || nickname.trim().length < 2}
        >
          Join Room
        </button>
      </form>
    </PageShell>
  );
}
