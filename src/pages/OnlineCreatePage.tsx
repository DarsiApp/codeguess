import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import Toggle from '@/components/Toggle';
import { createRoom } from '@/lib/rooms';
import { usePlayer } from '@/state/PlayerContext';
import type { CodeMode } from '@/lib/words';

export default function OnlineCreatePage() {
  const nav = useNavigate();
  const { username } = usePlayer();
  const [nickname, setNickname] = useState(username || '');
  const [mode, setMode] = useState<CodeMode>('word');
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const room = createRoom({ nickname: nickname.trim() || 'Host', isPublic, mode, allowRepeats });
    nav(`/online/game/${room.code}`);
  }

  return (
    <PageShell title="Create room" back="/online">
      <form className="space-y-5" onSubmit={submit}>
        <section className="card space-y-4 p-5">
          <div>
            <label className="label" htmlFor="nick">
              Your nickname
            </label>
            <input
              id="nick"
              className="input mt-2"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Robin"
              maxLength={20}
              required
            />
          </div>

          <div>
            <p className="label">Puzzle mode</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <ChipButton active={mode === 'word'} onClick={() => setMode('word')}>
                🌼 Word
              </ChipButton>
              <ChipButton active={mode === 'code'} onClick={() => setMode('code')}>
                🔣 Code
              </ChipButton>
            </div>
          </div>

          <Toggle
            checked={allowRepeats}
            onChange={setAllowRepeats}
            label="Allow repeated letters"
            hint="Lets the secret include duplicate letters."
          />
          <Toggle
            checked={isPublic}
            onChange={setIsPublic}
            label={isPublic ? 'Public room' : 'Private room'}
            hint={
              isPublic
                ? 'Anyone can find this from "Find game".'
                : 'Only people with the code can join.'
            }
          />
        </section>

        <button className="btn-primary w-full" type="submit" disabled={nickname.trim().length < 2}>
          Create room →
        </button>
      </form>
    </PageShell>
  );
}

function ChipButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border-2 px-4 py-3 text-sm font-bold uppercase tracking-wider shadow-cottageSm transition ${
        active
          ? 'border-clay bg-terracotta text-parchment'
          : 'border-bark/25 bg-parchment hover:bg-beige dark:border-parchment/15 dark:bg-nightbeige dark:hover:bg-nightsand'
      }`}
    >
      {children}
    </button>
  );
}
