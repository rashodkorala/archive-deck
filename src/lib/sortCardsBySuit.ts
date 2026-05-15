import type { Card } from './types'
import type { RankKey, SuitKey } from './standardDeck'

const SUIT_ORDER: Record<SuitKey, number> = {
  spades: 0,
  hearts: 1,
  diamonds: 2,
  clubs: 3,
}

const RANK_ORDER: Record<RankKey, number> = {
  ace: 0,
  '02': 1,
  '03': 2,
  '04': 3,
  '05': 4,
  '06': 5,
  '07': 6,
  '08': 7,
  '09': 8,
  '10': 9,
  jack: 10,
  queen: 11,
  king: 12,
}

/** Sort key: pip cards first (by suit then rank), then jokers by index */
function sortTuple(card: Card): [number, number, number, number] {
  if (card.kind === 'joker') {
    return [1, 0, 0, card.index]
  }
  return [0, SUIT_ORDER[card.suit], RANK_ORDER[card.rank], 0]
}

export function compareCardsBySuitOrder(a: Card, b: Card): number {
  const ta = sortTuple(a)
  const tb = sortTuple(b)
  for (let i = 0; i < ta.length; i++) {
    if (ta[i] !== tb[i]) return ta[i]! - tb[i]!
  }
  return 0
}

/** Stable canonical order: Spades A–K … Clubs A–K, then Joker I, Joker II */
export function sortCardsBySuitOrder(cards: Card[]): Card[] {
  return [...cards].sort(compareCardsBySuitOrder)
}
