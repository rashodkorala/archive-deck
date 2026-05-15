import {
  CARD_CORNER_RADIUS_PX,
  CARD_HEIGHT_PX,
  CARD_WIDTH_PX,
} from './cardSpec'
import {
  drawVintageCardFace,
  layoutVintageFrame,
} from './cardVintageFrame'
import type { CornerIndices } from './cornerIndices'

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = src
  })
}

export type RenderFacePngOptions = {
  imageSrc: string
  corners?: CornerIndices | null
  /** Match preview: when false, cream border + art only (no corner inlays / indices) */
  showCornerInlays?: boolean
}

async function ensureCanvasFonts(layout: ReturnType<typeof layoutVintageFrame>) {
  if (typeof document === 'undefined' || !document.fonts?.load) return
  try {
    await document.fonts.ready
    const spec = `${layout.rankFont}px "DM Sans"`
    await document.fonts.load(`700 ${spec}`)
    await document.fonts.load(`600 ${spec}`)
  } catch {
    /* system fallback */
  }
}

export async function renderFaceToPngBlob(
  options: RenderFacePngOptions | string,
): Promise<Blob> {
  const imageSrc = typeof options === 'string' ? options : options.imageSrc
  const corners = typeof options === 'string' ? null : (options.corners ?? null)
  const showCornerInlays =
    typeof options === 'string' ? true : (options.showCornerInlays ?? true)

  const img = await loadImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = CARD_WIDTH_PX
  canvas.height = CARD_HEIGHT_PX
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unsupported')

  const layout = layoutVintageFrame(
    CARD_WIDTH_PX,
    CARD_HEIGHT_PX,
    CARD_CORNER_RADIUS_PX,
  )
  await ensureCanvasFonts(layout)

  drawVintageCardFace(ctx, CARD_WIDTH_PX, CARD_HEIGHT_PX, img, layout, {
    corners,
    showCornerInlays: showCornerInlays && Boolean(corners),
  })

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('PNG export failed'))
      },
      'image/png',
      1,
    )
  })
}
