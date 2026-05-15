export type Card = {
  id: string
  /** `URL.createObjectURL` for front artwork */
  frontObjectUrl: string | null
  frontFileName: string | null
}

export type DeckState = {
  cards: Card[]
  /** Shared back for the whole deck */
  deckBackObjectUrl: string | null
  deckBackFileName: string | null
  selectedCardId: string | null
}
