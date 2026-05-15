import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from 'react'
import { getStandardDeckMeta } from '../lib/standardDeck'
import type { Card, DeckState } from '../lib/types'

function createStandardCards(): Card[] {
  return getStandardDeckMeta().map((meta) => ({
    ...meta,
    id: meta.slug,
    frontObjectUrl: null,
    frontFileName: null,
  }))
}

const initialState: DeckState = {
  cards: createStandardCards(),
  deckBackObjectUrl: null,
  deckBackFileName: null,
  selectedCardId: null,
}

function withDefaultSelection(state: DeckState): DeckState {
  if (state.cards.length === 0) {
    return { ...state, selectedCardId: null }
  }
  if (
    state.selectedCardId &&
    state.cards.some((c) => c.id === state.selectedCardId)
  ) {
    return state
  }
  return { ...state, selectedCardId: state.cards[0]!.id }
}

type Action =
  | { type: 'MOVE_CARD'; id: string; direction: 'up' | 'down' }
  | { type: 'SELECT_CARD'; id: string }
  | { type: 'SET_CARD_FRONT'; id: string; file: File }
  | { type: 'SET_DECK_BACK'; file: File }
  | { type: 'CLEAR_CARD_FRONT'; id: string }
  | { type: 'CLEAR_DECK_BACK' }

function revoke(url: string | null) {
  if (url) URL.revokeObjectURL(url)
}

function reducer(state: DeckState, action: Action): DeckState {
  switch (action.type) {
    case 'MOVE_CARD': {
      const idx = state.cards.findIndex((c) => c.id === action.id)
      if (idx < 0) return state
      const swap =
        action.direction === 'up' ? idx - 1 : idx + 1
      if (swap < 0 || swap >= state.cards.length) return state
      const cards = [...state.cards]
      ;[cards[idx], cards[swap]] = [cards[swap]!, cards[idx]!]
      return { ...state, cards }
    }
    case 'SELECT_CARD':
      return { ...state, selectedCardId: action.id }
    case 'SET_CARD_FRONT': {
      const cards = state.cards.map((c) => {
        if (c.id !== action.id) return c
        revoke(c.frontObjectUrl)
        const frontObjectUrl = URL.createObjectURL(action.file)
        return {
          ...c,
          frontObjectUrl,
          frontFileName: action.file.name,
        }
      })
      return { ...state, cards }
    }
    case 'SET_DECK_BACK': {
      revoke(state.deckBackObjectUrl)
      return {
        ...state,
        deckBackObjectUrl: URL.createObjectURL(action.file),
        deckBackFileName: action.file.name,
      }
    }
    case 'CLEAR_CARD_FRONT': {
      const cards = state.cards.map((c) => {
        if (c.id !== action.id) return c
        revoke(c.frontObjectUrl)
        return { ...c, frontObjectUrl: null, frontFileName: null }
      })
      return { ...state, cards }
    }
    case 'CLEAR_DECK_BACK': {
      revoke(state.deckBackObjectUrl)
      return {
        ...state,
        deckBackObjectUrl: null,
        deckBackFileName: null,
      }
    }
    default:
      return state
  }
}

export function useDeck() {
  const [state, dispatch] = useReducer(reducer, initialState, (s) =>
    withDefaultSelection(s),
  )

  const stateRef = useRef(state)

  useLayoutEffect(() => {
    stateRef.current = state
  })

  useEffect(() => {
    return () => {
      const s = stateRef.current
      for (const c of s.cards) revoke(c.frontObjectUrl)
      revoke(s.deckBackObjectUrl)
    }
  }, [])

  const moveCard = useCallback(
    (id: string, direction: 'up' | 'down') =>
      dispatch({ type: 'MOVE_CARD', id, direction }),
    [],
  )
  const selectCard = useCallback(
    (id: string) => dispatch({ type: 'SELECT_CARD', id }),
    [],
  )
  const setCardFront = useCallback(
    (id: string, file: File) => dispatch({ type: 'SET_CARD_FRONT', id, file }),
    [],
  )
  const setDeckBack = useCallback(
    (file: File) => dispatch({ type: 'SET_DECK_BACK', file }),
    [],
  )
  const clearCardFront = useCallback(
    (id: string) => dispatch({ type: 'CLEAR_CARD_FRONT', id }),
    [],
  )
  const clearDeckBack = useCallback(
    () => dispatch({ type: 'CLEAR_DECK_BACK' }),
    [],
  )

  const selectedCard =
    state.cards.find((c) => c.id === state.selectedCardId) ?? state.cards[0] ?? null

  return {
    state,
    selectedCard,
    moveCard,
    selectCard,
    setCardFront,
    setDeckBack,
    clearCardFront,
    clearDeckBack,
  }
}
