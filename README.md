# Card sheet

A browser-only editor for **poker-sized** playing card artwork (2.5 × 3.5 in). Upload a **face** per sheet and one **shared deck back**, preview with a quiet flip animation, then export **print-resolution PNGs** (750 × 1050 px at 300 DPI equivalent) or a **ZIP** of every face.

Images never leave your machine; there is no backend.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm lint
```

## Export behavior

- **Export this face** — saves the selected sheet’s front as `card-NN-face.png` after scaling and clipping to poker dimensions with rounded corners.
- **Export deck back** — saves the shared back as `deck-back.png` using the same pipeline.
- **Download all faces (ZIP)** — builds `deck-faces.zip` containing `faces/card-01.png`, `faces/card-02.png`, … only for sheets that have a front image. Sheets without a face are skipped in the archive.

Exports use the Canvas 2D API (`toBlob`), not DOM screenshots.

## Image tips

- **Resolution**: Larger sources than 750 × 1050 are fine; the app **covers** the card frame (center crop) to avoid letterboxing.
- **Format**: PNG, JPEG, or WebP uploads work in modern browsers.
- **Transparency**: PNG with alpha is flattened onto the card background when drawn to canvas.

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4, Motion, DM Sans + Cormorant Garamond (via Fontsource), JSZip.
