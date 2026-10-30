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

**No auto layout** (absolute positions): rebuild with flex/grid from the positions. `absolute` only for real overlaps — decor, badges, floating labels — anchored to the content container. Take their offsets from the node `bounds` (e.g. `top-6 right-7` from the icon's distance to the photo's top and right edges), never by eye, and put them in the spec.

## Sizes: what may be fixed
| Element | Fixed size | How instead |
|---|---|---|
| Text | ❌ no `h-*`, no `w-*` | width → `max-w-*`; height from lines |
| Cards | ❌ height; width only responsive | `w-[85%] lg:w-[30%] 3xl:w-[417px]`; equal heights via grid/flex + `h-full` + `mt-auto` |
| Sections | ❌ `h-*` | `min-h-*` (`md:min-h-[335px]`) |
| Buttons with text | ❌ `h-*` | padding + `min-h-*` |
| Icons, round icon buttons, avatars, dots | ✅ | `size-*`, `h-* w-*` |
| Media | ratio, not height | `aspect-[w/h]` + `next/image fill` |

A height that differs from Figma is a symptom: compare font size, line height, letter spacing, text width (wrapping), padding, gaps and Vertical trim. Never hide the difference with `h-*`, `max-h-*` + `overflow-hidden`, `line-clamp` or a magic gap.

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

Not exported: **text case** (UPPERCASE via style) — always compare headings, nav, buttons and the logo with `design/<id>.png`; keep the copy as written in `characters` and add `uppercase` (or `lowercase`) if the reference shows it.
Headings by meaning, not size: one `h1` (hero), `h2` per section title, `h3` for cards.

### Vertical trim (Figma "leading trim") — not exported, detect it
Figma can trim a text box from the cap height of the first line to the baseline of the last one (Typography → Type settings → Basics → Vertical trim → "Cap height to baseline"). The box is then shorter than `lines × lineHeight`, while all glyphs fit inside. It is **not** a design error.
- Signature: `h ≈ (lines − 1) × lineHeight + cap height` (cap height ≈ 0.62–0.78 × fontSize). Example: Poppins 12/20, 5 lines → 100 untrimmed, 88 in Figma. `section-check` prints a hint when it sees it.
- Ask the user to confirm the setting on that text in Figma (one click), then: `[text-box:trim-both_cap_alphabetic]` on the text element (CSS `text-box: trim-both cap alphabetic`; Chrome/Edge 133+, Safari 18.2+, Firefox 154+; older browsers simply show a little more air). Padding and gaps stay the Figma values.
- **Trim + fixed-height box** (Figma shows `Fill × 47`, not `Hug`): the box is taller than the trimmed text (2 × 28 trimmed ≈ 43 in a 47 box → 4 px empty under the text, top-aligned). Trim the text and add the extra px to the following gap (`gap-3` → `gap-4`) with a code comment explaining it.
- Only the texts that have trim get it — Figma often mixes trimmed and untrimmed texts in one card.
- **Real design error** = glyphs actually overflow the box in Figma. Rule out trim first, then ask: exact visual match (compensation with a code comment) or honest spacing.

### Copy
- Render design text **verbatim**, Lorem ipsum included. Fake copy is marked with a code comment above the field in `content/site.ts` — `// PLACEHOLDER: lorem from the design` — never inside the rendered string. Real design texts (names, prices, buttons, headings) are not placeholders. Never invent copy ("Customer Name", "Role").
- HTML collapses repeated spaces from `characters` — fine, it only shortens lines.
- Obvious typos in the design ("Explore Out Products", "INFOTNATION", "Plons & pricing"): fix them and list each one as «було → стало» in the report, so the user can confirm with the client (brand names and wordplay stay as they are).

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
| `clipsContent: true` | `overflow-hidden` on media/decor containers (`overflow-clip` on sections) — never to hide text that doesn't fit |
| `rotation` | `rotate-*` (mostly decor) |
| `constraints` | only for absolute children: MIN = left/top, MAX = right/bottom, CENTER, STRETCH = inset-x-0, SCALE = % |

## Components (by layer / component names)
Button → shadcn `Button` (variants via cva) · FAQ / accordion → `Accordion` · inputs → `Input`, `Textarea`, `Label` · mobile menu → `Sheet` · tabs → `Tabs` · modal → `Dialog`.
Prefer these over hand-made menus, accordions and modals. `shadcn init` already installed `radix-ui`, so `add` usually only writes `components/ui/<name>.tsx` — still ask before running `pnpm dlx shadcn@latest add <name>` (it can add dependencies).

## Assets
- small vector icons (16–32 px, `VECTOR` / icon component) → `lucide-react` icon **by the Figma layer name** (`arrow-right` → `ArrowRight`, `mdi:heart-outline` → `Heart`, not a look-alike chevron); brand/custom icons → SVG export.
- logos, illustrations made of vectors → SVG; photos and raster art → JPG `scale: 2`.
- full-bleed background images → JPG `scale: 2` (needed for 2560 px screens).
- alt text: look at the image and describe it (`"Latte with heart art on a wooden table"`); decorative → `alt=""`. Never a placeholder marker in `alt`.
- an asset re-exported in another format (JPG → PNG for transparency) → delete the old file; no unused files in `public/images/<id>/`.

## Tokens (first section) — Tailwind v4 + shadcn
- **Colors:** set the shadcn variables in `:root` of `app/globals.css` by role: `--background` (page bg), `--foreground` (main text), `--primary` / `--primary-foreground` (main CTA), `--secondary`, `--muted-foreground` (secondary text), `--accent`, `--card`, `--border`, `--ring`. Extra brand colors → `--brand-*` in `:root` + `--color-brand-*: var(--brand-*)` in `@theme inline`. Hex values are fine inside variables.
- **Fonts:** `next/font` with `variable: "--font-<name>"`, then `@theme inline { --font-sans: var(--font-<name>); --font-display: var(--font-<other>); }`. A third family used by a few sections → its own token/utility (`font-alt`), applied only there; never replace `--font-sans` to fit one section (it silently changes every finished section).
- **Type scale, section padding, spacing between sections, container, breakpoint 3xl:** see `breakpoints.md`.
- **Radius / shadow:** `--radius` (shadcn base) + `--radius-card`, `--shadow-card` etc. in `@theme`.
- Name by role, not by Figma names (`primary/500` → `--primary`). If Figma has variables (`get_variable_defs`), reuse their structure.

## Spec values (for `design/<id>.spec.json`)
- `lineHeight` in px: PIXELS → value; PERCENT → fontSize × value / 100; AUTO → omit.
- `letterSpacing` in px: PIXELS → value; PERCENT → fontSize × value / 100.
- `color` / `bg`: only solid fills with opacity 1 (the checker compares hex); skip gradients, images and semi-transparent fills.
- `radius`: `cornerRadius` (top-left corner when `cornerRadii` differ).
- `x`/`y`: sum `bounds.x/y` of the node and its parents up to the section.
- `gap`: `autoLayout.gap`; `rowGap` = `counterAxisSpacing` for wrapped rows.
- `h` on text with 2+ lines: the text node's `bounds.height` (lets the checker spot Vertical trim). `h` on cards and sections is diagnostic — it tells you something inside is off, it is never a reason for `h-*`.
- Absolutely positioned icons/badges/controls: `x y w h` from bounds (summed up to the section).
