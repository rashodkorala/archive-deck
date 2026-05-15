/** Clockwise steps only; keeps layout predictable */
export type RotationDeg = 0 | 90 | 180 | 270

export function normalizeRotationDeg(n: number): RotationDeg {
  const x = Math.round(n / 90) * 90
  const m = ((x % 360) + 360) % 360
  return m as RotationDeg
}

/** Rotate bitmap so “up” matches `deg` clockwise; 0° = original orientation. */
export function createRotatedBitmap(
  img: HTMLImageElement,
  deg: RotationDeg,
): HTMLImageElement | HTMLCanvasElement {
  if (deg === 0) return img
  const w = img.naturalWidth
  const h = img.naturalHeight
  if (w === 0 || h === 0) return img
  const swap = deg === 90 || deg === 270
  const cw = swap ? h : w
  const ch = swap ? w : h
  const canvas = document.createElement('canvas')
  canvas.width = cw
  canvas.height = ch
  const c = canvas.getContext('2d')
  if (!c) return img
  c.translate(cw / 2, ch / 2)
  c.rotate((deg * Math.PI) / 180)
  c.drawImage(img, -w / 2, -h / 2)
  return canvas
}
