import type { CornerIndices } from './cornerIndices'

/** Warm cream border like classic printed playing cards */
export const CARD_CREAM = '#f1e9df'
export const CARD_KEYLINE = '#171312'

export type VintageFrameLayout = {
  outerR: number
  pad: number
  innerR: number
  inlayW: number
  inlayH: number
  inlayCornerR: number
  keyline: number
  rankFont: number
  suitFont: number
}

export function layoutVintageFrame(
  cardW: number,
  cardH: number,
  outerCornerR: number,
): VintageFrameLayout {
  const pad = Math.round(Math.min(cardW, cardH) * 0.064)
  const inlayW = Math.round(cardW * 0.17)
  const inlayH = Math.round(cardH * 0.17)
  const inlayCornerR = Math.min(48, Math.round(Math.min(inlayW, inlayH) * 0.32))
  const innerR = Math.max(10, outerCornerR - pad * 0.35)
  const rankFont = Math.round(Math.min(cardW, cardH) * 0.09)
  const suitFont = Math.round(rankFont * 1.32)
  return {
    outerR: outerCornerR,
    pad,
    innerR,
    inlayW,
    inlayH,
    inlayCornerR,
    keyline: Math.max(1.5, Math.round(cardW / 420)),
    rankFont,
    suitFont,
  }
}

/** Outer card rounded rect path */
export function pathOuterRoundRect(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(rr, 0)
  ctx.lineTo(w - rr, 0)
  ctx.quadraticCurveTo(w, 0, w, rr)
  ctx.lineTo(w, h - rr)
  ctx.quadraticCurveTo(w, h, w - rr, h)
  ctx.lineTo(rr, h)
  ctx.quadraticCurveTo(0, h, 0, h - rr)
  ctx.lineTo(0, rr)
  ctx.quadraticCurveTo(0, 0, rr, 0)
  ctx.closePath()
}

function pathInnerRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.lineTo(x + w - rr, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr)
  ctx.lineTo(x + w, y + h - rr)
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h)
  ctx.lineTo(x + rr, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr)
  ctx.lineTo(x, y + rr)
  ctx.quadraticCurveTo(x, y, x + rr, y)
  ctx.closePath()
}

/** Top-left inlay: cream rect with bottom-right corner rounded toward center */
function pathTopLeftInlay(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  br: number,
): void {
  const r = Math.min(br, w * 0.5, h * 0.5)
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x, y + h)
  ctx.closePath()
}

/** Bottom-right inlay: rounded top-left (toward center) */
function pathBottomRightInlay(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  tl: number,
): void {
  const r = Math.min(tl, w * 0.5, h * 0.5)
  ctx.beginPath()
  ctx.moveTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h)
  ctx.lineTo(x, y + h)
  ctx.closePath()
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
): void {
  const ir = img.naturalWidth / img.naturalHeight
  const cr = dw / dh
  let sx = 0
  let sy = 0
  let sw = img.naturalWidth
  let sh = img.naturalHeight
  if (ir > cr) {
    sw = sh * cr
    sx = (img.naturalWidth - sw) / 2
  } else {
    sh = sw / cr
    sy = (img.naturalHeight - sh) / 2
  }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
}

export type DrawVintageFaceOptions = {
  corners: CornerIndices | null
  /** When false, only cream ring + inner art + keyline (no corner inlays / text) */
  showCornerInlays: boolean
}

/**
 * Draws full card: cream outer, inner artwork with keyline, optional corner inlays + indices.
 */
export function drawVintageCardFace(
  ctx: CanvasRenderingContext2D,
  cardW: number,
  cardH: number,
  img: HTMLImageElement,
  layout: VintageFrameLayout,
  opts: DrawVintageFaceOptions,
): void {
  const { pad, innerR, inlayW, inlayH, inlayCornerR, keyline, rankFont, suitFont } =
    layout

  ctx.save()
  pathOuterRoundRect(ctx, cardW, cardH, layout.outerR)
  ctx.fillStyle = CARD_CREAM
  ctx.fill()

  const ix = pad
  const iy = pad
  const iw = cardW - pad * 2
  const ih = cardH - pad * 2

  ctx.save()
  pathInnerRoundRect(ctx, ix, iy, iw, ih, innerR)
  ctx.clip()
  drawImageCover(ctx, img, ix, iy, iw, ih)
  ctx.restore()

  ctx.save()
  pathInnerRoundRect(ctx, ix, iy, iw, ih, innerR)
  ctx.strokeStyle = CARD_KEYLINE
  ctx.lineWidth = keyline
  ctx.stroke()
  ctx.restore()

  if (opts.showCornerInlays && opts.corners) {
    const c = opts.corners
    const ink = c.isRed ? '#b42318' : CARD_KEYLINE

    ctx.fillStyle = CARD_CREAM
    ctx.save()
    pathTopLeftInlay(ctx, ix, iy, inlayW, inlayH, inlayCornerR)
    ctx.fill()
    ctx.strokeStyle = CARD_KEYLINE
    ctx.lineWidth = keyline
    ctx.stroke()
    ctx.restore()

    ctx.save()
    pathBottomRightInlay(ctx, ix + iw - inlayW, iy + ih - inlayH, inlayW, inlayH, inlayCornerR)
    ctx.fill()
    ctx.strokeStyle = CARD_KEYLINE
    ctx.lineWidth = keyline
    ctx.stroke()
    ctx.restore()

    const fontStack =
      '"DM Sans",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'

    const tlCx = ix + inlayW / 2
    const tlCy = iy + inlayH / 2
    drawCenteredRankSuit(ctx, tlCx, tlCy, c, rankFont, suitFont, fontStack, ink)

    const brCx = ix + iw - inlayW / 2
    const brCy = iy + ih - inlayH / 2
    ctx.save()
    ctx.translate(brCx, brCy)
    ctx.rotate(Math.PI)
    drawCenteredRankSuit(ctx, 0, 0, c, rankFont, suitFont, fontStack, ink)
    ctx.restore()
  }
}

function drawCenteredRankSuit(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  c: { cornerRank: string; cornerSuit: string },
  rankFont: number,
  suitFont: number,
  fontStack: string,
  ink: string,
): void {
  ctx.save()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = ink
  const gap = rankFont * 0.16

  ctx.font = `700 ${rankFont}px ${fontStack}`
  const rm = ctx.measureText(c.cornerRank)
  const ascentR = rm.actualBoundingBoxAscent ?? rankFont * 0.72
  const descentR = rm.actualBoundingBoxDescent ?? rankFont * 0.22

  ctx.font = `600 ${suitFont}px ${fontStack}`
  const sm = ctx.measureText(c.cornerSuit)
  const ascentS = sm.actualBoundingBoxAscent ?? suitFont * 0.72
  const descentS = sm.actualBoundingBoxDescent ?? suitFont * 0.22

  const totalH = ascentR + descentR + gap + ascentS + descentS
  let y = cy - totalH / 2 + ascentR

  ctx.font = `700 ${rankFont}px ${fontStack}`
  ctx.fillText(c.cornerRank, cx, y)
  y += descentR + gap + ascentS

  ctx.font = `600 ${suitFont}px ${fontStack}`
  ctx.fillText(c.cornerSuit, cx, y)
  ctx.restore()
}
