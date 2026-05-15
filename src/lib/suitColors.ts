import type { CornerIndices } from './cornerIndices'
import { CARD_KEYLINE } from './cardVintageFrame'
import type { Card } from './types'
import type { SuitKey } from './standardDeck'

/** Four-color deck: distinct pip colors (rank stays dark for contrast). */
export const SUIT_PIP_HEX: Record<SuitKey, string> = {
  spades: '#1d4ed8',
  hearts: '#be123c',
  diamonds: '#c2410c',
  clubs: '#166534',
}

const RANK_HEX = CARD_KEYLINE

/** Corner / export metadata with per-element colours */
export function cornerIndicesFromCard(card: Card): CornerIndices {
  if (card.kind === 'joker') {
    return {
      cornerRank: card.cornerRank,
      cornerSuit: card.cornerSuit,
      isRed: card.isRed,
      rankColor: RANK_HEX,
      suitColor: card.index === 1 ? '#a16207' : '#64748b',
    }
  }
  return {
    cornerRank: card.cornerRank,
    cornerSuit: card.cornerSuit,
    isRed: card.isRed,
    rankColor: RANK_HEX,
    suitColor: SUIT_PIP_HEX[card.suit],
  }
}
