// Mastermind-style scoring. "Exact" counts letters that match position;
// "Hits" counts the total number of correct letters regardless of position
// (Exact letters are included in Hits). Repeated letters are matched at most
// once per occurrence in the secret.

export type GuessFeedback = {
  guess: string;
  exact: number;
  hits: number;
  // Per-letter status used for keyboard hints + per-slot color.
  perSlot: Array<'exact' | 'hit' | 'miss'>;
};

export function scoreGuess(secret: string, guess: string): GuessFeedback {
  const len = secret.length;
  const perSlot: Array<'exact' | 'hit' | 'miss'> = new Array(len).fill('miss');
  const secretLeft: Record<string, number> = {};
  let exact = 0;

  for (let i = 0; i < len; i++) {
    if (guess[i] === secret[i]) {
      exact++;
      perSlot[i] = 'exact';
    } else {
      secretLeft[secret[i]] = (secretLeft[secret[i]] ?? 0) + 1;
    }
  }

  let nonExactHits = 0;
  for (let i = 0; i < len; i++) {
    if (perSlot[i] === 'exact') continue;
    const ch = guess[i];
    if ((secretLeft[ch] ?? 0) > 0) {
      secretLeft[ch]! -= 1;
      perSlot[i] = 'hit';
      nonExactHits++;
    }
  }

  return { guess, exact, hits: exact + nonExactHits, perSlot };
}

export function isWin(fb: GuessFeedback, length = 5): boolean {
  return fb.exact === length;
}
