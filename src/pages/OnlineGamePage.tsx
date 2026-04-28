import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import HistoryList from '@/components/HistoryList';
import GuessRow from '@/components/GuessRow';
import Keyboard from '@/components/Keyboard';
import Confetti from '@/components/Confetti';
import {
  getOrInitPlayerId,
  getRoom,
  joinRoom,
  leaveRoom,
  postChat,
  rematch,
  startGame,
  submitGuess,
  subscribeRoom,
  type Room,
} from '@/lib/rooms';
import { usePlayer } from '@/state/PlayerContext';

export default function OnlineGamePage() {
  const { code = '' } = useParams();
  const nav = useNavigate();
  const { username } = usePlayer();
  const [room, setRoom] = useState<Room | null>(() => getRoom(code));
  const me = useMemo(() => getOrInitPlayerId(), []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!room) return;
    if (!room.players.find((p) => p.id === me)) {
      const r = joinRoom(code, username || 'Player');
      if (!('error' in r)) setRoom(r);
    }
  }, [room, code, me, username]);

  useEffect(() => {
    const unsub = subscribeRoom(code, setRoom);
    return unsub;
  }, [code]);

  useEffect(() => {
    return () => {
      const r = getRoom(code);
      if (r && r.status === 'lobby') leaveRoom(code);
    };
  }, [code]);

  if (!room) {
    return (
      <PageShell title="Online Game" back="/online">
        <section className="card p-8 text-center">
          <p className="text-3xl" aria-hidden>
            🍂
          </p>
          <p className="mt-3 font-display text-lg font-black uppercase">Room not found</p>
          <p className="mt-1 text-sm font-bold text-muted">
            That code doesn't match any open room. It may have been closed.
          </p>
          <Link to="/online" className="btn-sky mt-4 inline-flex">
            Back to online menu
          </Link>
        </section>
      </PageShell>
    );
  }

  const isHost = room.hostId === me;

  function onStart() {
    const r = startGame(code);
    if ('error' in r) setError(r.error);
    else {
      setError(null);
      setRoom(r);
    }
  }
  function onRematch() {
    const r = rematch(code);
    if ('error' in r) setError(r.error);
    else {
      setError(null);
      setRoom(r);
    }
  }

  return (
    <PageShell title={`Room ${room.code}`} back="/online">
      {error ? (
        <p className="mb-3 rounded-2xl border-3 border-line bg-amber/30 p-3 text-sm font-extrabold uppercase">
          {error}
        </p>
      ) : null}

      {room.status === 'lobby' ? (
        <Lobby room={room} isHost={isHost} me={me} onStart={onStart} />
      ) : null}
      {room.status === 'playing' ? <Playing room={room} me={me} /> : null}
      {room.status === 'finished' ? (
        <Finished
          room={room}
          me={me}
          isHost={isHost}
          onRematch={onRematch}
          onLeave={() => nav('/online')}
        />
      ) : null}

      <ChatPanel room={room} />
    </PageShell>
  );
}

function Lobby({
  room,
  isHost,
  me,
  onStart,
}: {
  room: Room;
  isHost: boolean;
  me: string;
  onStart: () => void;
}) {
  const [copied, setCopied] = useState(false);
  function copyCode() {
    navigator.clipboard.writeText(room.code).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => undefined,
    );
  }
  return (
    <div className="space-y-4">
      <section className="card p-5 text-center">
        <p className="label">Share this code</p>
        <p className="mt-2 font-display text-4xl font-black tracking-[0.4em] animate-floaty">{room.code}</p>
        <p className="mt-1 text-xs font-bold text-muted">
          {room.isPublic ? 'Public · listed in Find game' : 'Private · code only'} ·{' '}
          {room.mode === 'word' ? 'Word mode' : 'Code mode'} ·{' '}
          {room.allowRepeats ? 'repeats' : 'unique'}
        </p>
        <button className="btn-paper mt-3" onClick={copyCode}>
          {copied ? 'Copied!' : 'Copy code'}
        </button>
      </section>

      <section className="card p-5">
        <h2 className="label">Players in lobby</h2>
        <ul className="mt-3 space-y-2">
          {room.players.map((p, idx) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-2xl border-3 border-line bg-wash p-3"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full border-3 border-line bg-sky font-display text-sm font-black">
                  {p.nickname.slice(0, 2).toUpperCase()}
                </span>
                <span>
                  <span className="block font-extrabold">{p.nickname}</span>
                  <span className="text-xs font-bold text-muted">
                    {p.id === room.hostId ? 'Host' : `Player ${idx + 1}`}
                    {p.id === me ? ' · you' : ''}
                  </span>
                </span>
              </span>
              <span className="pill text-xs">Ready</span>
            </li>
          ))}
        </ul>
        {room.players.length < 2 ? (
          <p className="mt-3 text-center text-xs font-bold text-muted">
            Waiting for at least one more player…
          </p>
        ) : null}
      </section>

      {isHost ? (
        <button className="btn-sky w-full" onClick={onStart} disabled={room.players.length < 2}>
          Start Game
        </button>
      ) : (
        <p className="text-center text-sm font-bold text-muted">
          Host will start when everyone's in.
        </p>
      )}
    </div>
  );
}

function Playing({ room, me }: { room: Room; me: string }) {
  const length = room.secret.length || 5;
  const current = room.players[room.turnIndex];
  const myTurn = current?.id === me && !current.eliminated;
  const [draft, setDraft] = useState('');
  const [hwKeyboard, setHwKeyboard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function detect(e: KeyboardEvent) {
      if (e.isTrusted && /^[a-zA-Z]$/.test(e.key)) setHwKeyboard(true);
    }
    window.addEventListener('keydown', detect);
    return () => window.removeEventListener('keydown', detect);
  }, []);

  useEffect(() => {
    if (!myTurn) setDraft('');
  }, [myTurn]);

  function submit() {
    if (!myTurn) return;
    if (draft.length !== length) return;
    const r = submitGuess(room.code, draft);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setError(null);
    setDraft('');
  }

  function onKey(k: string) {
    if (!myTurn) return;
    setDraft((d) => (d.length < length ? d + k : d));
  }
  function backspace() {
    if (!myTurn) return;
    setDraft((d) => d.slice(0, -1));
  }

  return (
    <div className="space-y-5">
      <TurnPill room={room} me={me} />

      <GuessRow length={length} guess={myTurn ? draft : ''} active={myTurn} />

      {!myTurn ? (
        <p className="text-center text-xs font-extrabold uppercase tracking-widest text-muted">
          Waiting for {current?.nickname ?? '…'} to guess
        </p>
      ) : null}
      {error ? (
        <p className="text-center text-sm font-extrabold text-amberdeep">{error}</p>
      ) : null}

      <section className="card max-h-72 space-y-2 overflow-auto p-4 sm:p-5">
        <h2 className="label">Guess history</h2>
        {room.history.length === 0 ? (
          <p className="text-center text-sm font-bold text-muted">
            No guesses yet — taking turns.
          </p>
        ) : (
          <ol className="space-y-2">
            {room.history.map((h, idx) => (
              <li
                key={idx}
                className="rounded-2xl border-3 border-line bg-wash p-2"
              >
                <p className="px-1 pb-1 text-[11px] font-extrabold uppercase tracking-widest text-muted">
                  {h.authorName}
                </p>
                <HistoryList history={[h.feedback]} length={length} />
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="btn-paper"
          onClick={backspace}
          disabled={!myTurn || draft.length === 0}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn-sky"
          onClick={submit}
          disabled={!myTurn || draft.length !== length}
        >
          Lock In Answer
        </button>
      </div>

      <Keyboard
        history={room.history.map((h) => h.feedback)}
        onKey={onKey}
        onEnter={submit}
        onBackspace={backspace}
        hidden={hwKeyboard}
        disabled={!myTurn}
      />

      {myTurn && hwKeyboard ? (
        <p className="text-center text-xs font-extrabold uppercase tracking-widest text-muted">
          Type a guess and hit Enter
        </p>
      ) : null}
    </div>
  );
}

function TurnPill({ room, me }: { room: Room; me: string }) {
  const cur = room.players[room.turnIndex];
  if (!cur) return null;
  const mine = cur.id === me;
  return (
    <div className="sticky top-2 z-20 mx-auto w-fit">
      <div className={`pill animate-slideUp text-sm ${mine ? 'bg-sky' : ''}`}>
        <span aria-hidden>{mine ? '🎯' : '⏳'}</span>
        <span>{mine ? 'Your turn' : `${cur.nickname}'s turn`}</span>
      </div>
    </div>
  );
}

function Finished({
  room,
  me,
  isHost,
  onRematch,
  onLeave,
}: {
  room: Room;
  me: string;
  isHost: boolean;
  onRematch: () => void;
  onLeave: () => void;
}) {
  const winner = room.players.find((p) => p.id === room.winnerId);
  const iWon = winner?.id === me;
  return (
    <div className="space-y-4">
      {iWon ? <Confetti /> : null}
      <section className="card p-6 text-center">
        <p className="label">{iWon ? 'You cracked it' : 'Round over'}</p>
        <p className="mt-2 font-display text-3xl font-black uppercase">
          {winner ? `${winner.nickname} wins!` : 'No winner'}
        </p>
        <p className="mt-2 text-sm font-bold text-muted">
          Secret was{' '}
          <span className="font-display text-lg font-black tracking-[0.3em]">{room.secret}</span>
        </p>
      </section>

      <section className="card p-5">
        <h2 className="label">Final history</h2>
        <ol className="mt-3 space-y-2">
          {room.history.map((h, idx) => (
            <li key={idx}>
              <p className="px-1 pb-1 text-[11px] font-extrabold uppercase tracking-widest text-muted">
                {h.authorName}
              </p>
              <HistoryList history={[h.feedback]} length={room.secret.length} />
            </li>
          ))}
        </ol>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        {isHost ? (
          <button className="btn-sky" onClick={onRematch}>
            Rematch
          </button>
        ) : (
          <p className="rounded-2xl border-3 border-line bg-wash p-3 text-center text-sm font-bold text-muted">
            Waiting for host to rematch…
          </p>
        )}
        <button className="btn-paper" onClick={onLeave}>
          Leave room
        </button>
      </div>
    </div>
  );
}

function ChatPanel({ room }: { room: Room }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open)
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [room.chat.length, open]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    postChat(room.code, text);
    setText('');
  }

  return (
    <>
      <button
        className="icon-btn fixed bottom-4 right-4 z-30"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle chat"
      >
        💬
      </button>
      {open ? (
        <div
          className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-3xl px-4 pb-4 sm:px-6"
          role="dialog"
        >
          <div className="card flex max-h-[60vh] flex-col p-3 animate-slideUp">
            <div className="flex items-center justify-between px-1 pb-2">
              <h3 className="label">Room chat</h3>
              <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <div ref={listRef} className="min-h-[8rem] flex-1 space-y-2 overflow-auto px-1 pb-2">
              {room.chat.length === 0 ? (
                <p className="text-center text-xs font-bold text-muted">Say hi to your room.</p>
              ) : (
                room.chat.map((m) => (
                  <div key={m.id} className="rounded-2xl border-3 border-line bg-wash p-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
                      {m.authorName}
                    </p>
                    <p className="text-sm">{m.text}</p>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={send} className="flex gap-2 pt-1">
              <input
                className="input flex-1"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Send a message"
                maxLength={240}
              />
              <button className="btn-sky px-4" type="submit" disabled={!text.trim()}>
                Send
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
