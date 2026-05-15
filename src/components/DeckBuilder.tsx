import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import JSZip from 'jszip'
import { useCallback, useState } from 'react'
import { useDeck } from '../hooks/useDeck'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { CARD_HEIGHT_PX, CARD_WIDTH_PX } from '../lib/cardSpec'
import { downloadBlob } from '../lib/download'
import { renderFaceToPngBlob } from '../lib/renderCardToPng'
import { AppShell } from './AppShell'
import { CardPreview } from './CardPreview'
import { UploadField } from './UploadField'

export function DeckBuilder() {
  const reduced = usePrefersReducedMotion()
  const {
    state,
    selectedCard,
    moveCard,
    selectCard,
    setCardFront,
    setDeckBack,
    clearCardFront,
    clearDeckBack,
  } = useDeck()

  const [showBack, setShowBack] = useState(false)
  const [showCornerIndices, setShowCornerIndices] = useState(true)
  const [busy, setBusy] = useState(false)
  const [banner, setBanner] = useState<string | null>(null)

  const showMessage = useCallback((msg: string) => {
    setBanner(msg)
    window.setTimeout(() => setBanner(null), 3200)
  }, [])

  const exportFace = useCallback(async () => {
    if (!selectedCard?.frontObjectUrl) {
      showMessage('Add a face image before exporting.')
      return
    }
    setBusy(true)
    try {
      const blob = await renderFaceToPngBlob({
        imageSrc: selectedCard.frontObjectUrl,
        corners: {
          cornerRank: selectedCard.cornerRank,
          cornerSuit: selectedCard.cornerSuit,
          isRed: selectedCard.isRed,
        },
        showCornerInlays: showCornerIndices,
      })
      downloadBlob(blob, `${selectedCard.exportStem}-face.png`)
      showMessage('Face exported as PNG.')
    } catch {
      showMessage('Export failed — try another image format.')
    } finally {
      setBusy(false)
    }
  }, [selectedCard, showCornerIndices, showMessage])

  const exportBack = useCallback(async () => {
    if (!state.deckBackObjectUrl) {
      showMessage('Add a deck back image first.')
      return
    }
    setBusy(true)
    try {
      const blob = await renderFaceToPngBlob({
        imageSrc: state.deckBackObjectUrl,
        corners: null,
        showCornerInlays: false,
      })
      downloadBlob(blob, 'deck-back.png')
      showMessage('Deck back exported as PNG.')
    } catch {
      showMessage('Export failed — try another image format.')
    } finally {
      setBusy(false)
    }
  }, [state.deckBackObjectUrl, showMessage])

  const exportAllFaces = useCallback(async () => {
    const withFaces = state.cards.filter((c) => c.frontObjectUrl)
    if (withFaces.length === 0) {
      showMessage('No card faces to export yet.')
      return
    }
    setBusy(true)
    try {
      const zip = new JSZip()
      const folder = zip.folder('faces')
      if (!folder) throw new Error('zip folder')
      for (const c of state.cards) {
        if (!c.frontObjectUrl) continue
        const blob = await renderFaceToPngBlob({
          imageSrc: c.frontObjectUrl,
          corners: {
            cornerRank: c.cornerRank,
            cornerSuit: c.cornerSuit,
            isRed: c.isRed,
          },
          showCornerInlays: showCornerIndices,
        })
        folder.file(`${c.exportStem}.png`, blob)
      }
      const out = await zip.generateAsync({ type: 'blob' })
      downloadBlob(out, 'deck-faces.zip')
      showMessage('ZIP downloaded — all faces at poker resolution.')
    } catch {
      showMessage('ZIP export failed.')
    } finally {
      setBusy(false)
    }
  }, [state.cards, showCornerIndices, showMessage])

  const listStagger = reduced ? 0 : 0.06

  return (
    <AppShell>
      <header className="mb-10 flex flex-col gap-3 border-b border-line pb-8 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-[12px] font-semibold uppercase tracking-[0.28em] text-ink-muted">
            Atelier
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-surface sm:text-5xl">
            Card sheet
          </h1>
          <p className="mt-2 max-w-md text-[14px] text-ink-muted">
            Full <strong className="font-medium text-surface/90">54-card</strong> set
            (52 suits + 2 jokers): each slot has rank and suit labels; upload artwork
            per face. One shared back — export print-ready PNGs or a ZIP of every
            face.
          </p>
        </div>
        <p className="text-[12px] text-ink-muted sm:text-right">
          Nothing leaves your browser.
        </p>
      </header>

      <AnimatePresence>
        {banner ? (
          <motion.div
            key={banner}
            role="status"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 rounded-lg border border-line-strong bg-surface-raised/95 px-4 py-3 text-[13px] text-ink shadow-[var(--shadow-panel)]"
          >
            {banner}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid flex-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.1fr)]">
        <section className="flex flex-col items-center lg:items-start">
          <div className="mb-6 flex w-full max-w-[min(72vw,320px)] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
              Preview
            </p>
            <label className="flex cursor-pointer items-center gap-2 text-[12px] text-ink-muted">
              <input
                type="checkbox"
                className="size-3.5 rounded border-line-strong text-accent focus:ring-accent"
                checked={showCornerIndices}
                onChange={(e) => setShowCornerIndices(e.target.checked)}
              />
              Corner indices & inlays
            </label>
          </div>
          <CardPreview
            frontUrl={selectedCard?.frontObjectUrl ?? null}
            backUrl={state.deckBackObjectUrl}
            showBack={showBack}
            onToggleFace={() => setShowBack((v) => !v)}
            cornerIndices={
              selectedCard
                ? {
                    cornerRank: selectedCard.cornerRank,
                    cornerSuit: selectedCard.cornerSuit,
                    isRed: selectedCard.isRed,
                  }
                : null
            }
            showCornerIndices={showCornerIndices}
            cardTitle={selectedCard?.fullName ?? null}
          />
        </section>

        <section className="flex min-w-0 flex-col gap-10">
          <div className="rounded-2xl border border-line bg-surface/95 p-6 shadow-[var(--shadow-panel)] sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-line pb-5">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                  Deck
                </h2>
                <p className="mt-1 text-[13px] text-ink-muted">
                  {state.cards.length} cards · reorder for your export order
                </p>
              </div>
            </div>

            <LayoutGroup id="deck-list">
              <ul className="flex flex-col gap-1">
                {state.cards.map((card, index) => {
                  const selected = card.id === selectedCard?.id
                  return (
                    <motion.li
                      key={card.id}
                      layout
                      initial={false}
                      transition={{
                        layout: { duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] },
                      }}
                      style={{ transitionDelay: `${index * listStagger}s` }}
                    >
                      <div
                        className={[
                          'flex w-full items-center gap-3 rounded-xl border px-3 py-3 transition-colors',
                          selected
                            ? 'border-accent/50 bg-white/80'
                            : 'border-transparent hover:border-line hover:bg-white/50',
                        ].join(' ')}
                      >
                        <button
                          type="button"
                          onClick={() => selectCard(card.id)}
                          className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        >
                          <span className="font-display w-11 shrink-0 text-center text-[12px] font-semibold tabular-nums text-ink-muted">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-display text-[17px] font-semibold tracking-tight text-ink">
                              {card.shortLabel}
                            </span>
                            <span className="block truncate text-[12px] text-ink-muted">
                              {card.fullName}
                            </span>
                            <span className="block truncate text-[11px] text-ink-muted/90">
                              {card.frontObjectUrl
                                ? (card.frontFileName ?? 'Image attached')
                                : 'Awaiting face artwork'}
                            </span>
                          </span>
                        </button>
                        <div className="flex shrink-0 gap-1" role="group" aria-label="Card order">
                          <button
                            type="button"
                            className="rounded-md border border-line bg-white/60 px-2 py-1 text-[11px] font-medium text-ink hover:bg-white disabled:opacity-30"
                            disabled={index === 0}
                            onClick={() => moveCard(card.id, 'up')}
                          >
                            Up
                          </button>
                          <button
                            type="button"
                            className="rounded-md border border-line bg-white/60 px-2 py-1 text-[11px] font-medium text-ink hover:bg-white disabled:opacity-30"
                            disabled={index === state.cards.length - 1}
                            onClick={() => moveCard(card.id, 'down')}
                          >
                            Down
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  )
                })}
              </ul>
            </LayoutGroup>
          </div>

          <div className="grid gap-8 rounded-2xl border border-line bg-surface/95 p-6 shadow-[var(--shadow-panel)] sm:p-8">
            <div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                Face
              </h3>
              {selectedCard ? (
                <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                  {selectedCard.shortLabel}
                  <span className="ml-2 text-[13px] font-sans font-normal text-ink-muted">
                    {selectedCard.exportStem}.png in ZIP
                  </span>
                </p>
              ) : null}
              <p className="mt-1 text-[13px] text-ink-muted">
                Artwork sits inside the cream border; rank and suit sit in the corner
                inlays when enabled. PNG export matches the preview (including the
                frame).
              </p>
              <div className="mt-5">
                {selectedCard ? (
                  <UploadField
                    label="Front image"
                    hint={`${CARD_WIDTH_PX} × ${CARD_HEIGHT_PX} target`}
                    previewUrl={selectedCard.frontObjectUrl}
                    fileName={selectedCard.frontFileName}
                    onFile={(file) => setCardFront(selectedCard.id, file)}
                    onClear={() => clearCardFront(selectedCard.id)}
                    disabled={busy}
                  />
                ) : null}
              </div>
            </div>

            <hr className="border-line" />

            <div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                Back
              </h3>
              <p className="mt-1 text-[13px] text-ink-muted">
                One back for the whole deck — mirrored on every sheet.
              </p>
              <div className="mt-5">
                <UploadField
                  label="Deck back"
                  hint="Shared"
                  previewUrl={state.deckBackObjectUrl}
                  fileName={state.deckBackFileName}
                  onFile={setDeckBack}
                  onClear={clearDeckBack}
                  disabled={busy}
                />
              </div>
            </div>
          </div>

          <footer className="sticky bottom-4 z-10 mt-2 rounded-2xl border border-line-strong bg-surface-raised/95 p-5 shadow-[var(--shadow-card)] backdrop-blur sm:p-6">
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
              Export
            </p>
            <p className="mt-1 text-[12px] text-ink-muted">
              PNG · {CARD_WIDTH_PX} × {CARD_HEIGHT_PX}px · cream border + keyline
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                disabled={busy || !selectedCard?.frontObjectUrl}
                onClick={exportFace}
                className="rounded-full bg-accent px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                Export this face
              </button>
              <button
                type="button"
                disabled={busy || !state.deckBackObjectUrl}
                onClick={exportBack}
                className="rounded-full border border-line-strong bg-white/70 px-5 py-2.5 text-[13px] font-semibold text-ink hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Export deck back
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={exportAllFaces}
                className="rounded-full border border-transparent px-5 py-2.5 text-[13px] font-semibold text-ink-muted hover:text-ink"
              >
                Download all faces (ZIP)
              </button>
            </div>
          </footer>
        </section>
      </div>
    </AppShell>
  )
}
