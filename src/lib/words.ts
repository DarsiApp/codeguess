// Curated 5-letter cottagecore-friendly word list. Used for Word mode and the
// Daily Challenge. Kept short and hand-picked so codes feel "wordy" without
// requiring a full dictionary download.
export const WORD_LIST: readonly string[] = [
  'APPLE', 'BREAD', 'CRANE', 'DAISY', 'EMBER', 'FROST', 'GLADE', 'HONEY',
  'IVORY', 'JOLLY', 'KNAVE', 'LEMON', 'MAPLE', 'NORTH', 'OLIVE', 'PEACH',
  'QUILT', 'ROBIN', 'STONE', 'THYME', 'UMBER', 'VIOLA', 'WHEAT', 'YEAST',
  'BERRY', 'CABIN', 'DUSKY', 'EARTH', 'FAIRY', 'GHOST', 'HEART', 'INDEX',
  'JEWEL', 'KNOLL', 'LARCH', 'MOTHS', 'NESTS', 'OAKEN', 'PETAL', 'QUERY',
  'RIVER', 'SUGAR', 'TULIP', 'UNDER', 'VINES', 'WILLO', 'AMBER', 'BLOOM',
  'CLOUD', 'DREAM', 'FERNS', 'GLOWS', 'HEDGE', 'IRONY', 'LOAFS', 'MOSSY',
  'NECTAR', 'ORBIT', 'PINES', 'ROAST', 'SPICE', 'TWINE', 'WOVEN', 'YIELD',
].filter((w) => w.length === 5);

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export type CodeMode = 'word' | 'code';

export function pickWord(allowRepeats: boolean): string {
  const pool = allowRepeats
    ? WORD_LIST
    : WORD_LIST.filter((w) => new Set(w).size === w.length);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickCode(allowRepeats: boolean): string {
  const out: string[] = [];
  const used = new Set<string>();
  while (out.length < 5) {
    const ch = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    if (!allowRepeats && used.has(ch)) continue;
    out.push(ch);
    used.add(ch);
  }
  return out.join('');
}

export function generateSecret(mode: CodeMode, allowRepeats: boolean): string {
  return mode === 'word' ? pickWord(allowRepeats) : pickCode(allowRepeats);
}

// Daily challenge: deterministic per-day pick from WORD_LIST.
export function dailyWord(date = new Date()): string {
  const epoch = Date.UTC(2024, 0, 1);
  const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const dayIndex = Math.floor((today - epoch) / 86400000);
  const idx = ((dayIndex % WORD_LIST.length) + WORD_LIST.length) % WORD_LIST.length;
  return WORD_LIST[idx];
}
