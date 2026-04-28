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
    const room = createRoom({
      nickname: nickname.trim() || 'Host',
      isPublic,
      mode,
      allowRepeats,
    });
    nav(`/online/game/${room.code}`);
  }

  return (
    <PageShell title="Create Room" back="/online">
      <form className="mx-auto max-w-md space-y-5" onSubmit={submit}>
        <section className="card space-y-5 p-5">
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
              <Chip active={mode === 'word'} onClick={() => setMode('word')}>
                📖 Word
              </Chip>
              <Chip active={mode === 'code'} onClick={() => setMode('code')}>
                🔀 Code
              </Chip>
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

        <button className="btn-sky w-full" type="submit" disabled={nickname.trim().length < 2}>
          Create Room
        </button>
      </form>
    </PageShell>
  );
}

function Chip({
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
      className={`pick ${active ? 'pick-active' : ''}`}
    >
      <span className="font-display text-lg font-black">{children}</span>
    </button>
  );
}
