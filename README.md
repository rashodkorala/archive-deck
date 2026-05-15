# Card sheet

A browser-only editor for a full **54-card** poker-sized deck (2.5 × 3.5 in): **52 suited ranks** (spades, hearts, diamonds, clubs — ace through king in that order) plus **two jokers**. Each slot has a **short label** (e.g. `A♠`, `10♥`), a **full name** (e.g. `Ace of Spades`), and optional **corner rank/suit overlays on the preview** (toggle “Corner labels”). Upload a **face image per card** and one **shared deck back**, then export **print-resolution PNGs** (750 × 1050 px) or a **ZIP** of every face you have filled in.

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

- **Export this face** — saves the selected card’s front as `{exportStem}-face.png` (for example `spades-ace-face.png`, `hearts-10-face.png`, `joker-01-face.png`) after scaling and clipping to poker dimensions with rounded corners.
- **Export deck back** — saves the shared back as `deck-back.png` using the same pipeline.
- **Download all faces (ZIP)** — builds `deck-faces.zip` with files under `faces/` named `{exportStem}.png` (e.g. `faces/clubs-king.png`) for every card that has a front image. Cards without artwork are skipped.

Corner labels are **preview-only**; exported PNGs are your artwork only unless you bake indices into the image file.

Exports use the Canvas 2D API (`toBlob`), not DOM screenshots.

## Image tips

- **Resolution**: Larger sources than 750 × 1050 are fine; the app **covers** the card frame (center crop) to avoid letterboxing.
- **Format**: PNG, JPEG, or WebP uploads work in modern browsers.
- **Transparency**: PNG with alpha is flattened onto the card background when drawn to canvas.

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4, Motion, DM Sans + Cormorant Garamond (via Fontsource), JSZip.
