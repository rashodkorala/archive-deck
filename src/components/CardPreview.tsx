import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { CARD_ASPECT_RATIO, CARD_HEIGHT_PX, CARD_WIDTH_PX } from '../lib/cardSpec'

export type CornerIndices = {
  cornerRank: string
  cornerSuit: string
  isRed: boolean
}

type CardPreviewProps = {
  frontUrl: string | null
  backUrl: string | null
  showBack: boolean
  onToggleFace: () => void
  /** When set and `showCornerIndices`, draws rank/suit in corners on the face side */
  cornerIndices: CornerIndices | null
  showCornerIndices: boolean
  /** Shown under the flip control, e.g. full card name */
  cardTitle?: string | null
}

function CornerOverlay({ c }: { c: CornerIndices }) {
  const color = c.isRed ? 'text-[#b42318]' : 'text-ink'
  return (
    <>
      <div
        className={`pointer-events-none absolute left-0 top-0 z-10 flex flex-col items-start p-[7%] font-display leading-none ${color}`}
        aria-hidden
      >
        <span className="text-[clamp(0.95rem,4.2vw,1.35rem)] font-semibold tracking-tight">
          {c.cornerRank}
        </span>
        <span className="mt-0.5 text-[clamp(1rem,4.8vw,1.5rem)] font-medium">
          {c.cornerSuit}
        </span>
      </div>
      <div
        className={`pointer-events-none absolute bottom-0 right-0 z-10 flex rotate-180 flex-col items-start p-[7%] font-display leading-none ${color}`}
        aria-hidden
      >
        <span className="text-[clamp(0.95rem,4.2vw,1.35rem)] font-semibold tracking-tight">
          {c.cornerRank}
        </span>
        <span className="mt-0.5 text-[clamp(1rem,4.8vw,1.5rem)] font-medium">
          {c.cornerSuit}
        </span>
      </div>
    </>
  )
}

export function CardPreview({
  frontUrl,
  backUrl,
  showBack,
  onToggleFace,
  cornerIndices,
  showCornerIndices,
  cardTitle,
}: CardPreviewProps) {
  const reduced = usePrefersReducedMotion()
  const duration = reduced ? 0 : 0.48
  const captionMissing =
    !showBack && !frontUrl
      ? 'Upload a face to preview this side.'
      : showBack && !backUrl
        ? 'Upload a deck back to preview this side.'
        : null

  const showCorners =
    Boolean(cornerIndices) && showCornerIndices && !showBack

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        className="relative w-[min(72vw,320px)]"
        style={{ perspective: reduced ? undefined : 1200 }}
      >
        <motion.div
          className="relative w-full"
          style={{
            aspectRatio: `${CARD_ASPECT_RATIO}`,
            transformStyle: 'preserve-3d',
          }}
          animate={{ rotateY: showBack ? 180 : 0 }}
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-black/5"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0.1px) rotateY(0deg)',
            }}
          >
            {frontUrl ? (
              <img
                src={frontUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-surface to-surface-raised px-6 text-center text-[13px] text-ink-muted">
                Face artwork
              </div>
            )}
            {showCorners && cornerIndices ? (
              <CornerOverlay c={cornerIndices} />
            ) : null}
          </div>

          <div
            className="absolute inset-0 overflow-hidden rounded-2xl bg-void shadow-[var(--shadow-card)] ring-1 ring-white/10"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0.1px) rotateY(180deg)',
            }}
          >
            {backUrl ? (
              <img
                src={backUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-void to-ink px-6 text-center text-[13px] text-surface/75">
                Deck back
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="flex max-w-[min(72vw,320px)] flex-col items-center gap-2">
        {cardTitle ? (
          <p className="text-center font-display text-lg font-semibold tracking-tight text-surface">
            {cardTitle}
          </p>
        ) : null}
        <button
          type="button"
          onClick={onToggleFace}
          className="rounded-full border border-line-strong bg-surface-raised/90 px-5 py-2 text-[12px] font-medium tracking-wide text-ink hover:border-accent/40 hover:bg-surface"
        >
          {showBack ? 'Show face' : 'Show back'}
        </button>
        {captionMissing ? (
          <p className="max-w-[260px] text-center text-[12px] text-ink-muted">
            {captionMissing}
          </p>
        ) : (
          <p className="text-center text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            Poker · 2.5 × 3.5 in · {CARD_WIDTH_PX} × {CARD_HEIGHT_PX}px export
          </p>
        )}
      </div>
    </div>
  )
}
