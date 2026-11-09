# Breakpoints, scales, container

## Widths we support and check
| Width | Device | Tailwind | What must hold |
|---|---|---|---|
| 360 | small Android (smallest we support) | base | one column, 16 px gutters, body ≥ 16 px, tap targets ≥ 44 px |
| 768 | tablet portrait | `md:` | 2-column grids, still stacked hero |
| 1024 | tablet landscape / small laptop | `lg:` | desktop structure starts (split layouts, nav links) |
| 1280 | laptop | `xl:` | desktop structure, fluid sizes still below design |
| 1440 | large laptop | (`xl:`) | gutters ≥ 48 px — content must not touch edges |
| 1920 | design frame | `3xl:` | equals Figma (spec + pixel diff) |
| 2560 | 2K / QHD | above `3xl` | content stops at design width, backgrounds full-bleed |

`2xl:` (1536) stays available for rare in-between fixes.

## Theme setup (`app/globals.css`, Tailwind v4)
```css
@theme {
  --breakpoint-3xl: 120rem;                 /* 1920 */
  --container-content: 75rem;               /* design content width, e.g. 1200 */
  --spacing-section: clamp(3rem, 1.962rem + 4.615vw, 7.5rem);   /* 48 → 120 */
  --text-display: clamp(2.25rem, 1.731rem + 2.308vw, 4.5rem);   /* 36 → 72 */
  --text-display--line-height: 1.111;       /* 80 / 72 from Figma */
  --text-h2: clamp(1.75rem, 1.462rem + 1.282vw, 3rem);          /* 28 → 48 */
  --text-h2--line-height: 1.2;
}
```
Values are examples — compute yours from the design (formula below). Utilities: `text-display`, `text-h2`, `py-section`, `max-w-content`, `3xl:`.

Tailwind v4 notes:
- shadcn puts its tokens into `@theme inline`. Variables there are compiled into the utilities and are **not** emitted as CSS variables in `:root` unless used, so `var(--my-token)` in your own CSS can be empty. Put your own tokens into a plain `@theme { … }` block.
- Custom classes: use `@utility name { … }`, not `@layer utilities { .name { … } }`. Only `@utility` classes work with variants (`lg:`, `hover:`) and get sorted by Prettier.

## Container
```tsx
<section id="services" className="bg-muted py-section">          {/* background: full-bleed */}
  <div className="mx-auto w-full max-w-content px-4 md:px-8 lg:px-12">
    …
  </div>
</section>
```
- `--container-content` = width of the content column in the 1920 frame (frame width − left − right padding of the section's inner frame).
- Gutters: 16 → 32 → 48 px. At 1920 the container is centered and the gutters are invisible, so 1920 still matches Figma.
- Full-bleed media (hero background, wide images) sit outside the container; everything readable sits inside.
- Above 1920 nothing grows: fluid tokens stop at their max, the container stops at `max-w-content`. The 2560 check reports anything that stretched.

## Fluid size formula (360 → 1920)
For a value `D` at 1920 and a minimum `M` at 360:
```
slope     = (D − M) / 1560
intercept = M − slope × 360
token     = clamp(M/16 rem, intercept/16 rem + slope×100 vw, D/16 rem)
```
Check: at 1920 it returns exactly `D`, so the spec check passes. Ready values:
| D at 1920 | M at 360 | token | at 768 / 1280 / 1440 |
|---|---|---|---|
| 72 | 36 | `clamp(2.25rem, 1.731rem + 2.308vw, 4.5rem)` | 45 / 57 / 61 |
| 48 | 28 | `clamp(1.75rem, 1.462rem + 1.282vw, 3rem)` | 33 / 40 / 42 |
| 32 | 20 | `clamp(1.25rem, 1.077rem + 0.769vw, 2rem)` | 23 / 27 / 28 |
| 120 (section padding) | 48 | `clamp(3rem, 1.962rem + 4.615vw, 7.5rem)` | 67 / 90 / 98 |

Line height in tokens is a **ratio** (Figma px / font size), so it scales with the size.

## Type: what is fluid, what steps
| Design size at 1920 | Mobile minimum | How |
|---|---|---|
| display ≥ 56 | 36–40 | fluid token |
| h1/h2 40–56 | 28–32 | fluid token |
| h3 24–32 | 20–24 | fluid token or `text-xl xl:text-2xl` |
| lead 20–24 | 18 | steps: `text-lg xl:text-xl` |
| body 16–20 | 16 (never less) | steps: `text-base xl:text-lg` |
| small 14 | 14 | fixed |
| < 14 (legal, captions) | 12 | fixed + `data-allow-small` on the wrapper |
Paragraph width: keep the design width as `max-w-*`, and never wider than ~70ch.

## Spacing between sections (from `design/page.json`)
Figma section frames often sit at a distance from each other; that distance is not inside any section, so the per-section check can't see it. `figma-import` step 1 writes it into `design/page.json` as `gapBefore`.
```css
/* app/globals.css — one utility per distinct gapBefore, fluid 360 → 1920, max = design value */
@utility mt-section-lg {
  margin-top: clamp(2.5rem, 1.923rem + 2.564vw, 5rem); /* 40 → 80 px */
}
@utility mt-section-sm {
  margin-top: clamp(2rem, 1.538rem + 2.051vw, 4rem);   /* 32 → 64 px */
}
```
```tsx
// app/page.tsx — the page owns the rhythm; sections accept className and merge it with cn()
<ProductSection id="coffee-menu" className="mt-section-lg" … />
<Promo className="mt-section-sm" />
```
- Mobile minimum ≈ half of the design gap (never below 24 px). Name by size (`-sm`, `-lg`) or role (`-tight`).
- Margin, not padding: a section with a background must not grow into the gap.
- `gapBefore: 0` → no class (sections touch in the design).
- Verify with `node scripts/section-check.mjs --page`.

## Spacing inside sections
- Section vertical padding: `py-section` (fluid). Sections with a different design padding get their own token.
- Gaps ≥ 48 px: step down — `gap-8 md:gap-12 xl:gap-[design]` — or a fluid token if used often.
- Gaps ≤ 32 px: keep the design value at all widths unless the 360 check shows cramping.
- Spacing inside cards stays the same at all widths (cards just get narrower).

## Grids
| Items | 360 | 768 | 1024+ |
|---|---|---|---|
| 2 | 1 col | 2 cols or 1 | 2 cols |
| 3 | 1 col | 1 col or 3 compact | 3 cols |
| 4 | 1 col | 2 cols | 4 cols (`lg:` or `xl:` if cards are text-heavy) |
| 5–6 | 1 col | 2 cols | 3 cols |
| logos 6–12 | 2–3 cols | 4 cols | design count in one row |

## Media
- Keep the Figma ratio: `aspect-[w/h]` with `next/image fill` + `sizes`.
- `sizes` = the image's **real width at every breakpoint** — the browser picks the file from it before layout, so a
  too-big `sizes` downloads a too-big file. Derive it from the layout, not by eye:
  - split: `(min-width: 1024px) 50vw, 100vw`; full-bleed: `(min-width: 1920px) 1920px, 100vw`;
  - grid / carousel of N cards: slot ≈ (container − gaps) / N per breakpoint, e.g. 4 visible cards from `lg:` and
    2 from `md:` → `(min-width: 1920px) 366px, (min-width: 1024px) 25vw, (min-width: 768px) 50vw, 85vw`
    (a fixed 1920 design width → px; a carousel showing 85 % of a card on phones → `85vw`).
  - Check: `visual-check` reports "images much wider than shown" when a file is > 1.5× its rendered width.
- Full-bleed hero on laptops: Next's default device sizes jump 1200 → 1920, so a 1280–1440 screen downloads 1920w.
  Add the steps in `next.config.ts`: `images.deviceSizes: [640, 750, 828, 1080, 1200, 1280, 1440, 1600, 1920, 2048, 3840]`.
- Large media in a split → full width on mobile, can switch to a shorter ratio (`aspect-[4/3]` → `aspect-video`) if the block gets too tall.

## Touch and forms (< 1024)
Buttons and links ≥ 44 × 44 px (`min-h-11`), inputs `text-base` (16 px — prevents iOS zoom), button groups stack full-width (`w-full sm:w-auto`).
