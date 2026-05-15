import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { CARD_ASPECT_RATIO, CARD_HEIGHT_PX, CARD_WIDTH_PX } from '../lib/cardSpec'
import { CARD_CREAM, CARD_KEYLINE } from '../lib/cardVintageFrame'
import type { CornerIndices } from '../lib/cornerIndices'

export type { CornerIndices }

type CardPreviewProps = {
  frontUrl: string | null
  backUrl: string | null
  showBack: boolean
  onToggleFace: () => void
  cornerIndices: CornerIndices | null
  showCornerIndices: boolean
  cardTitle?: string | null
}

function VintageFrame({
  children,
  cornerIndices,
  showCornerIndices,
}: {
  children: React.ReactNode
  cornerIndices: CornerIndices | null
  showCornerIndices: boolean
}) {
  const ink = cornerIndices?.isRed ? '#b42318' : CARD_KEYLINE
  const showInlays = Boolean(cornerIndices) && showCornerIndices

  return (
    <div
      className="h-full w-full shadow-[var(--shadow-card)]"
      style={{
        backgroundColor: CARD_CREAM,
        borderRadius: '4.6%',
        padding: '6.4%',
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden bg-neutral-900/5 [container-type:inline-size]"
        style={{
          borderRadius: '3.1%',
          boxShadow: `inset 0 0 0 2px ${CARD_KEYLINE}`,
        }}
      >
        {children}
        {showInlays && cornerIndices ? (
          <>
            <div
              className="pointer-events-none absolute left-0 top-0 z-10 w-[17%] min-w-0 border-b-2 border-r-2 font-sans leading-none"
              style={
                {
                  height: '24%',
                  backgroundColor: CARD_CREAM,
                  borderColor: CARD_KEYLINE,
                  borderBottomRightRadius: 'clamp(0.75rem, 5.5cqw, 3rem)',
                  fontSize: 'clamp(0.65rem, 8.5cqw, 2rem)',
                } as CSSProperties
              }
              aria-hidden
            >
              <div className="flex h-full w-full flex-col items-center justify-center gap-[0.16em] px-[6%] py-[8%]">
                <span
                  className="text-[1em] font-bold tracking-tight"
                  style={{ color: ink }}
                >
                  {cornerIndices.cornerRank}
                </span>
                <span
                  className="text-[1.32em] font-semibold leading-none"
                  style={{ color: ink }}
                >
                  {cornerIndices.cornerSuit}
                </span>
              </div>
            </div>
            <div
              className="pointer-events-none absolute bottom-0 right-0 z-10 w-[17%] min-w-0 border-l-2 border-t-2 font-sans leading-none"
              style={
                {
                  height: '24%',
                  backgroundColor: CARD_CREAM,
                  borderColor: CARD_KEYLINE,
                  borderTopLeftRadius: 'clamp(0.75rem, 5.5cqw, 3rem)',
                  fontSize: 'clamp(0.65rem, 8.5cqw, 2rem)',
                } as CSSProperties
              }
              aria-hidden
            >
              <div className="flex h-full w-full rotate-180 flex-col items-center justify-center gap-[0.16em] px-[6%] py-[8%]">
                <span
                  className="text-[1em] font-bold tracking-tight"
                  style={{ color: ink }}
                >
                  {cornerIndices.cornerRank}
                </span>
                <span
                  className="text-[1.32em] font-semibold leading-none"
                  style={{ color: ink }}
                >
                  {cornerIndices.cornerSuit}
                </span>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
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
            className="absolute inset-0 overflow-hidden shadow-[var(--shadow-card)] ring-1 ring-black/10"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0.1px) rotateY(0deg)',
              borderRadius: '4.8%',
            }}
          >
            <VintageFrame
              cornerIndices={cornerIndices}
              showCornerIndices={showCornerIndices && !showBack}
            >
              {frontUrl ? (
                <img
                  src={frontUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[120px] w-full items-center justify-center bg-gradient-to-b from-[#e8dfd4] to-[#ddd2c6] px-4 text-center text-[12px] text-neutral-600">
                  Face artwork
                </div>
              )}
            </VintageFrame>
          </div>

          <div
            className="absolute inset-0 overflow-hidden shadow-[var(--shadow-card)] ring-1 ring-white/10"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0.1px) rotateY(180deg)',
              borderRadius: '4.8%',
            }}
          >
            <VintageFrame cornerIndices={null} showCornerIndices={false}>
              {backUrl ? (
                <img
                  src={backUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[120px] w-full items-center justify-center bg-gradient-to-b from-void to-ink px-4 text-center text-[12px] text-surface/75">
                  Deck back
                </div>
              )}
            </VintageFrame>
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
            Poker · 2.5 × 3.5 in · {CARD_WIDTH_PX} × {CARD_HEIGHT_PX}px export · vintage
            border
          </p>
        )}
      </div>
    </div>
  )
}
