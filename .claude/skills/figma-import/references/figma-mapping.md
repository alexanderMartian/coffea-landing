# Figma (Bridge `get_node` JSON) → code

`get_node` returns for every node: `id, name, type, bounds {x, y, width, height}` (relative to the parent), `styles {...}`, `children`, and for TEXT `characters` + text styles. Fields below are exactly the Bridge names.

## Auto layout → flex / grid
| Figma (`styles.autoLayout`) | Code |
|---|---|
| `direction: HORIZONTAL` | `flex flex-row` (on mobile often `flex-col` — see the patterns) |
| `direction: VERTICAL` | `flex flex-col` |
| `gap` | `gap-*` — Tailwind v4 accepts any multiple of 4 px: `gap-18` = 72 px |
| `primaryAxisAlign` MIN / CENTER / MAX / SPACE_BETWEEN | `justify-start` / `justify-center` / `justify-end` / `justify-between` |
| `counterAxisAlign` MIN / CENTER / MAX / BASELINE | `items-start` / `items-center` / `items-end` / `items-baseline` |
| `primaryAxisSizing` / `counterAxisSizing` AUTO (hug) | no size on that axis |
| `... FIXED` | size from `bounds` → becomes `max-w-*` / basis / token, never a hard `w-[...]` on text containers |
| `wrap: WRAP` + `counterAxisSpacing` | `flex-wrap gap-x-* gap-y-*`; equal-width children → prefer `grid grid-cols-*` |
| `styles.padding {top,right,bottom,left}` | `pt-* pr-* pb-* pl-*` (`px-*`/`py-*` when equal); section paddings → fluid token (breakpoints.md) |

**Child sizing is not exported — infer it:**
- child width ≈ parent width − paddingLeft − paddingRight → **fill**: `w-full` (column) or `flex-1` (row, when siblings share space);
- child width = its content → **hug**: no width;
- otherwise **fixed**: `basis-*` / `max-w-*` / a token.

**No auto layout** (absolute positions): rebuild with flex/grid from the positions. `absolute` only for real overlaps — decor, badges, floating labels — anchored to the content container.

## Text
| Figma | Code |
|---|---|
| `fontFamily`, `fontWeight` | font token; weight `font-*` (100 thin … 900 black) |
| `fontSize` | type token (fluid for ≥ 32 px, breakpoints.md) |
| `lineHeight {unit: PIXELS, value}` | ratio = value / fontSize → in the token (`--text-*--line-height`) or `leading-[1.1]` |
| `lineHeight {unit: PERCENT, value}` | ratio = value / 100 |
| `lineHeight {unit: AUTO}` | ≈ 1.2; leave default unless the reference shows otherwise |
| `letterSpacing {unit: PERCENT, value}` | `tracking-[value/100 em]` e.g. −2 % → `tracking-[-0.02em]` |
| `letterSpacing {unit: PIXELS, value}` | em = value / fontSize |
| `textAlignHorizontal` | `text-left / text-center / text-right` (avoid justify) |
| `textAutoResize: WIDTH_AND_HEIGHT` | hug — no width |
| `textAutoResize: HEIGHT` or `NONE` | fixed width in Figma → `max-w-[..px]` or `max-w-[NNch]`, height grows |
| `textAutoResize: TRUNCATE` | `line-clamp-*` |
| `textDecoration: UNDERLINE` | `underline` |
| `"mixed"` values | several styles in one text → check the reference image, use `<span>`s |

Not exported: **text case** (UPPERCASE via style) — check `design/<id>.png`; keep the copy as written in `characters` and add `uppercase` if the reference shows caps.
Headings by meaning, not size: one `h1` (hero), `h2` per section title, `h3` for cards.

## Paint, effects, shape
| Figma | Code |
|---|---|
| `fills: SOLID {color, opacity}` | color token; opacity < 1 → `bg-primary/80` |
| `fills: GRADIENT_LINEAR {gradientStops}` | `bg-linear-<angle>` / token `--gradient-*` if reused; read the angle from the reference |
| `fills: IMAGE {scaleMode}` | `next/image`; FILL/CROP → `object-cover` (+ `object-[x_y]` for crop), FIT → `object-contain` |
| `effects: DROP_SHADOW {offset, radius, spread, color, opacity}` | `box-shadow: x y radius spread rgba()` → token `--shadow-*` |
| `effects: INNER_SHADOW` | same with `inset` |
| `effects: LAYER_BLUR {radius}` / `BACKGROUND_BLUR` | `blur-[r/2 px]` / `backdrop-blur-[r/2 px]` (CSS blur ≈ half of Figma radius) |
| `strokes` + `strokeWeight`, `strokeAlign: INSIDE` | `border border-*` |
| `strokeAlign: OUTSIDE` | `ring-*` or `outline` |
| `cornerRadius` / `cornerRadii` | radius token / `rounded-tl-* …` |
| `opacity` (node) | `opacity-*` |
| `clipsContent: true` | `overflow-hidden` (`overflow-clip` on sections) |
| `rotation` | `rotate-*` (mostly decor) |
| `constraints` | only for absolute children: MIN = left/top, MAX = right/bottom, CENTER, STRETCH = inset-x-0, SCALE = % |

## Components (by layer / component names)
Button → shadcn `Button` (variants via cva) · FAQ / accordion → `Accordion` · inputs → `Input`, `Textarea`, `Label` · mobile menu → `Sheet` · tabs → `Tabs` · modal → `Dialog`.
Adding a shadcn component the first time can install dependencies — ask before running `pnpm dlx shadcn@latest add <name>`.

## Assets
- small vector icons (16–32 px, `VECTOR` / icon component) → closest `lucide-react` icon; brand/custom icons → SVG export.
- logos, illustrations made of vectors → SVG; photos and raster art → JPG `scale: 2`.
- full-bleed background images → JPG `scale: 2` (needed for 2560 px screens).
- alt text: meaningful → describe; decorative → `alt=""`.

## Tokens (first section) — Tailwind v4 + shadcn
- **Colors:** set the shadcn variables in `:root` of `app/globals.css` by role: `--background` (page bg), `--foreground` (main text), `--primary` / `--primary-foreground` (main CTA), `--secondary`, `--muted-foreground` (secondary text), `--accent`, `--card`, `--border`, `--ring`. Extra brand colors → `--brand-*` in `:root` + `--color-brand-*: var(--brand-*)` in `@theme inline`. Hex values are fine inside variables.
- **Fonts:** `next/font` with `variable: "--font-<name>"`, then `@theme inline { --font-sans: var(--font-<name>); --font-display: var(--font-<other>); }`.
- **Type scale, section spacing, container, breakpoint 3xl:** see `breakpoints.md`.
- **Radius / shadow:** `--radius` (shadcn base) + `--radius-card`, `--shadow-card` etc. in `@theme`.
- Name by role, not by Figma names (`primary/500` → `--primary`). If Figma has variables (`get_variable_defs`), reuse their structure.

## Spec values (for `design/<id>.spec.json`)
- `lineHeight` in px: PIXELS → value; PERCENT → fontSize × value / 100; AUTO → omit.
- `letterSpacing` in px: PIXELS → value; PERCENT → fontSize × value / 100.
- `color` / `bg`: only solid fills with opacity 1 (the checker compares hex); skip gradients, images and semi-transparent fills.
- `radius`: `cornerRadius` (top-left corner when `cornerRadii` differ).
- `x`/`y`: sum `bounds.x/y` of the node and its parents up to the section.
- `gap`: `autoLayout.gap`; `rowGap` = `counterAxisSpacing` for wrapped rows.
