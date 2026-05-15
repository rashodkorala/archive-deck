import type { StandardCardMeta } from './standardDeck'
import type { RotationDeg } from './imageRotation'

export type Card = StandardCardMeta & {
  /** Stable id; matches `slug` for standard cards */
  id: string
  /** `URL.createObjectURL` for front artwork */
  frontObjectUrl: string | null
  frontFileName: string | null
  /** Clockwise; applied before cover-fit into the face frame */
  frontRotationDeg: RotationDeg
}

export type DeckState = {
  cards: Card[]
  /** Shared back for the whole deck */
  deckBackObjectUrl: string | null
  deckBackFileName: string | null
  deckBackRotationDeg: RotationDeg
  selectedCardId: string | null
}
