// Local "online" room store. There's no real backend wired up yet, so we
// simulate multiplayer state in localStorage so two browser tabs on the same
// machine can play against each other. Public rooms appear in /online/find.

import { load, save } from './storage';
import { generateSecret, type CodeMode } from './words';
import { scoreGuess, type GuessFeedback } from './score';

export type RoomPlayer = {
  id: string;
  nickname: string;
  eliminated: boolean;
  joinedAt: number;
};

export type RoomMessage = {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  ts: number;
};

export type RoomEntry = {
  guess: string;
  feedback: GuessFeedback;
  authorId: string;
  authorName: string;
  ts: number;
};

export type Room = {
  code: string;
  hostId: string;
  isPublic: boolean;
  mode: CodeMode;
  allowRepeats: boolean;
  status: 'lobby' | 'playing' | 'finished';
  secret: string;
  players: RoomPlayer[];
  turnIndex: number;
  history: RoomEntry[];
  chat: RoomMessage[];
  winnerId?: string;
  createdAt: number;
};

const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const ROOMS_KEY = 'cg.rooms';

function rid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function makeRoomCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) code += ALPHA[Math.floor(Math.random() * ALPHA.length)];
  return code;
}

function loadAll(): Record<string, Room> {
  return load<Record<string, Room>>(ROOMS_KEY, {});
}

function saveAll(map: Record<string, Room>): void {
  save(ROOMS_KEY, map);
}

export function getOrInitPlayerId(): string {
  let id = localStorage.getItem('cg.playerId');
  if (!id) {
    id = rid('p');
    localStorage.setItem('cg.playerId', id);
  }
  return id;
}

export function listPublicRooms(): Room[] {
  return Object.values(loadAll())
    .filter((r) => r.isPublic && r.status === 'lobby')
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function getRoom(code: string): Room | null {
  const map = loadAll();
  return map[code] ?? null;
}

export function createRoom(opts: {
  nickname: string;
  isPublic: boolean;
  mode: CodeMode;
  allowRepeats: boolean;
}): Room {
  const map = loadAll();
  const playerId = getOrInitPlayerId();
  let code = makeRoomCode();
  while (map[code]) code = makeRoomCode();
  const room: Room = {
    code,
    hostId: playerId,
    isPublic: opts.isPublic,
    mode: opts.mode,
    allowRepeats: opts.allowRepeats,
    status: 'lobby',
    secret: '',
    players: [
      {
        id: playerId,
        nickname: opts.nickname || 'Host',
        eliminated: false,
        joinedAt: Date.now(),
      },
    ],
    turnIndex: 0,
    history: [],
    chat: [],
    createdAt: Date.now(),
  };
  map[code] = room;
  saveAll(map);
  return room;
}

export function joinRoom(code: string, nickname: string): Room | { error: string } {
  const map = loadAll();
  const room = map[code];
  if (!room) return { error: 'Room not found' };
  if (room.status === 'finished') return { error: 'Room is closed' };
  const playerId = getOrInitPlayerId();
  if (!room.players.find((p) => p.id === playerId)) {
    if (room.status !== 'lobby') return { error: 'Game already started' };
    if (room.players.length >= 8) return { error: 'Room is full' };
    room.players.push({
      id: playerId,
      nickname: nickname || 'Player',
      eliminated: false,
      joinedAt: Date.now(),
    });
  }
  map[code] = room;
  saveAll(map);
  return room;
}

export function leaveRoom(code: string): void {
  const map = loadAll();
  const room = map[code];
  if (!room) return;
  const playerId = getOrInitPlayerId();
  room.players = room.players.filter((p) => p.id !== playerId);
  if (room.players.length === 0) {
    delete map[code];
  } else {
    if (room.hostId === playerId) room.hostId = room.players[0].id;
    if (room.turnIndex >= room.players.length) room.turnIndex = 0;
  }
  saveAll(map);
}

export function startGame(code: string): Room | { error: string } {
  const map = loadAll();
  const room = map[code];
  if (!room) return { error: 'Room not found' };
  const me = getOrInitPlayerId();
  if (room.hostId !== me) return { error: 'Only the host can start' };
  if (room.players.length < 2) return { error: 'Need at least 2 players' };
  if (room.status !== 'lobby') return { error: 'Already started' };
  room.status = 'playing';
  room.secret = generateSecret(room.mode, room.allowRepeats);
  room.history = [];
  room.turnIndex = 0;
  room.players = room.players.map((p) => ({ ...p, eliminated: false }));
  map[code] = room;
  saveAll(map);
  return room;
}

export function rematch(code: string): Room | { error: string } {
  const map = loadAll();
  const room = map[code];
  if (!room) return { error: 'Room not found' };
  if (room.hostId !== getOrInitPlayerId()) return { error: 'Only the host can rematch' };
  room.status = 'lobby';
  room.secret = '';
  room.history = [];
  room.turnIndex = 0;
  room.winnerId = undefined;
  room.players = room.players.map((p) => ({ ...p, eliminated: false }));
  map[code] = room;
  saveAll(map);
  return room;
}

export function submitGuess(
  code: string,
  guess: string,
): { ok: true; room: Room } | { ok: false; error: string } {
  const map = loadAll();
  const room = map[code];
  if (!room) return { ok: false, error: 'Room not found' };
  if (room.status !== 'playing') return { ok: false, error: 'Game not active' };
  const me = getOrInitPlayerId();
  const current = room.players[room.turnIndex];
  if (!current || current.id !== me) return { ok: false, error: "It's not your turn" };
  if (guess.length !== room.secret.length) return { ok: false, error: 'Wrong length' };

  const fb = scoreGuess(room.secret, guess.toUpperCase());
  room.history.push({
    guess: fb.guess,
    feedback: fb,
    authorId: me,
    authorName: current.nickname,
    ts: Date.now(),
  });

  if (fb.exact === room.secret.length) {
    room.status = 'finished';
    room.winnerId = me;
  } else {
    // advance turn to next non-eliminated player
    let next = room.turnIndex;
    for (let i = 0; i < room.players.length; i++) {
      next = (next + 1) % room.players.length;
      if (!room.players[next].eliminated) break;
    }
    room.turnIndex = next;
  }
  map[code] = room;
  saveAll(map);
  return { ok: true, room };
}

export function postChat(code: string, text: string): Room | null {
  const map = loadAll();
  const room = map[code];
  if (!room) return null;
  const me = getOrInitPlayerId();
  const player = room.players.find((p) => p.id === me);
  if (!player) return null;
  room.chat.push({
    id: rid('m'),
    authorId: me,
    authorName: player.nickname,
    text: text.trim().slice(0, 240),
    ts: Date.now(),
  });
  if (room.chat.length > 80) room.chat = room.chat.slice(-80);
  map[code] = room;
  saveAll(map);
  return room;
}

// Cross-tab subscription: storage events fire when another tab writes to
// localStorage. We re-poll the room and notify listeners.
export function subscribeRoom(code: string, cb: (room: Room | null) => void): () => void {
  let last = JSON.stringify(getRoom(code));
  function check() {
    const cur = getRoom(code);
    const ser = JSON.stringify(cur);
    if (ser !== last) {
      last = ser;
      cb(cur);
    }
  }
  function onStorage(e: StorageEvent) {
    if (e.key === ROOMS_KEY) check();
  }
  window.addEventListener('storage', onStorage);
  // Belt-and-suspenders: poll for same-tab updates that don't fire `storage`.
  const interval = window.setInterval(check, 600);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.clearInterval(interval);
  };
}
