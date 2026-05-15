/** Rank/suit (or joker marks) drawn in corner inlays */
export type CornerIndices = {
  cornerRank: string
  cornerSuit: string
  /** Legacy: hearts/diamonds (and joker I accent); kept for filters / hints */
  isRed: boolean
  rankColor: string
  suitColor: string
}
