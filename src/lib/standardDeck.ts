/** Standard 54-card deck: 52 + 2 jokers. Order: Spades A–K, Hearts, Diamonds, Clubs, then two jokers. */

export type SuitKey = 'spades' | 'hearts' | 'diamonds' | 'clubs'

export type RankKey =
  | 'ace'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | 'jack'
  | 'queen'
  | 'king'

export type StandardCardMeta =
  | {
      kind: 'rank'
      suit: SuitKey
      rank: RankKey
      slug: string
      shortLabel: string
      fullName: string
      /** Filename-safe stem, e.g. `spades-ace` */
      exportStem: string
      cornerRank: string
      cornerSuit: string
      isRed: boolean
    }
  | {
      kind: 'joker'
      index: 1 | 2
      slug: string
      shortLabel: string
      fullName: string
      exportStem: string
      cornerRank: string
      cornerSuit: string
      isRed: boolean
    }

const SUIT_ORDER: { key: SuitKey; symbol: string; name: string }[] = [
  { key: 'spades', symbol: '♠', name: 'Spades' },
  { key: 'hearts', symbol: '♥', name: 'Hearts' },
  { key: 'diamonds', symbol: '♦', name: 'Diamonds' },
  { key: 'clubs', symbol: '♣', name: 'Clubs' },
]

const RANK_ORDER: {
  key: RankKey
  letter: string
  word: string
}[] = [
  { key: 'ace', letter: 'A', word: 'Ace' },
  { key: '02', letter: '2', word: 'Two' },
  { key: '03', letter: '3', word: 'Three' },
  { key: '04', letter: '4', word: 'Four' },
  { key: '05', letter: '5', word: 'Five' },
  { key: '06', letter: '6', word: 'Six' },
  { key: '07', letter: '7', word: 'Seven' },
  { key: '08', letter: '8', word: 'Eight' },
  { key: '09', letter: '9', word: 'Nine' },
  { key: '10', letter: '10', word: 'Ten' },
  { key: 'jack', letter: 'J', word: 'Jack' },
  { key: 'queen', letter: 'Q', word: 'Queen' },
  { key: 'king', letter: 'K', word: 'King' },
]

function rankFullName(
  rank: RankKey,
  word: string,
  suitPlural: string,
): string {
  switch (rank) {
    case 'ace':
      return `Ace of ${suitPlural}`
    case 'jack':
      return `Jack of ${suitPlural}`
    case 'queen':
      return `Queen of ${suitPlural}`
    case 'king':
      return `King of ${suitPlural}`
    default:
      return `${word} of ${suitPlural}`
  }
}

function buildRankCards(): StandardCardMeta[] {
  const out: StandardCardMeta[] = []
  for (const { key: suit, symbol, name } of SUIT_ORDER) {
    const isRed = suit === 'hearts' || suit === 'diamonds'
    for (const { key: rank, letter, word } of RANK_ORDER) {
      const exportStem = `${suit}-${rank}`
      out.push({
        kind: 'rank',
        suit,
        rank,
        slug: exportStem,
        shortLabel: `${letter}${symbol}`,
        fullName: rankFullName(rank, word, name),
        exportStem,
        cornerRank: letter,
        cornerSuit: symbol,
        isRed,
      })
    }
  }
  return out
}

function buildJokers(): StandardCardMeta[] {
  return [1, 2].map((n) => ({
    kind: 'joker' as const,
    index: n as 1 | 2,
    slug: `joker-0${n}`,
    shortLabel: n === 1 ? 'Joker I' : 'Joker II',
    fullName: n === 1 ? 'Joker (first)' : 'Joker (second)',
    exportStem: `joker-0${n}`,
    cornerRank: 'JK',
    cornerSuit: '★',
    isRed: n === 1,
  }))
}

/** All 52 pip cards + 2 jokers in canonical order */
export function getStandardDeckMeta(): StandardCardMeta[] {
  return [...buildRankCards(), ...buildJokers()]
}

export const STANDARD_DECK_SIZE = 54
